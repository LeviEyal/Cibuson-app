"use node";

import { clerkClient } from "@clerk/clerk-sdk-node";
import { type gmail_v1, google } from "googleapis";
import moment from "moment";
import OpenAI from "openai";

import { internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { action } from "../_generated/server";
import { rateLimiter } from "../rateLimiter";

const { htmlToText } = require("html-to-text");

// date should be in the format of YYYY-MM-DD
function validateFromDate(fromDate: string) {
  if (!fromDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error("Invalid date format");
  }
}

type NewVoucher = Omit<Doc<"cibusVouchers">, "_id" | "_creationTime">;

async function parseEmailWithAI(text: string): Promise<{
  barcodeNumber?: string;
  url?: string;
  amount?: number;
}> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Extract the following information from this Cibus email:
1. Barcode number (a 17-23 digit number)
2. URL (starting with something like https://u45438565.ct.sendgrid.net or https://myconsumers.pluxee.co.il/b?)
3. Amount charged (number after ₪)

Format the response as a JSON object with these fields:
{
  "barcodeNumber": "string or null if not found",
  "url": "string or null if not found",
  "amount": "number or null if not found"
}

Email content:
${text}`;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a precise email parser that extracts specific information and returns it in JSON format.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" },
  });

  console.log({ chatCompletion });

  const result = JSON.parse(chatCompletion.choices[0].message.content!);
  return {
    barcodeNumber: result.barcodeNumber === "null" || result.barcodeNumber === null ? undefined : String(result.barcodeNumber),
    url: result.url === "null" || result.url === null ? undefined : String(result.url),
    amount: result.amount === "null" || result.amount === null ? undefined : Number(result.amount),
  };
}

async function processMessage(
  ctx: any,
  message: gmail_v1.Schema$Message,
  gmail: gmail_v1.Gmail,
  userId: string,
) {
  const parts = message.payload?.parts || [];
  const newVoucher = {} as NewVoucher;

  for (const part of parts) {
    if (part.mimeType === "image/gif") {
      const attachmentId = part.body?.attachmentId;
      if (!attachmentId || !part.filename?.startsWith("img1")) continue;
      const attachment = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId: message.id || "",
        id: attachmentId,
      });
      const data =
        attachment.data.data?.replace(/-/g, "+").replace(/_/g, "/") || "";
      newVoucher.gif = data ? `data:image/gif;base64,${data}` : "";
    } else if (part.mimeType === "text/html") {
      const data = part.body?.data || "";
      const htmlContent = Buffer.from(data, "base64").toString("utf8");

      const text = htmlToText(htmlContent, {
        wordwrap: 130,
      }) || "";

      console.log({ text });

      const parsedData = await parseEmailWithAI(text);
      newVoucher.url = parsedData.url || "";
      newVoucher.amount = parsedData.amount || 0;
      newVoucher.barcodeNumber = parsedData.barcodeNumber;
    }
  }

  console.log({ newVoucher });

  // We consider a voucher valid if at least one of the url or gif is present
  // and the amount is present
  if ((newVoucher.url || newVoucher.gif) && newVoucher.amount) {
    const toInsert = {
      userId,
      url: newVoucher.url,
      amount: newVoucher.amount,
      gif: newVoucher.gif,
      date: Number.parseInt(message.internalDate as string),
      barcodeNumber: newVoucher.barcodeNumber,
      provider: "cibus" as const,
    };

    await ctx.runMutation(internal.cibus.cibusQueries.addVouchers, {
      vouchers: [toInsert],
    });
  }
}

export const updateCibusVouchers = action({
  handler: async (ctx) => {
    const lastDate = await ctx.runQuery(
      internal.cibus.cibusQueries.getLastUserVoucherDate,
    );

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { ok, retryAfter } = await rateLimiter.limit(
      ctx,
      "updateCibusVouchers",
      {
        key: identity.subject,
      },
    );

    if (!ok) {
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }

    // Get the last date of the vouchers or 1 month ago if no vouchers exist
    const lastDate2 = lastDate || moment().subtract(1, "month").toDate();
    const lastDateFormatted = moment(lastDate2).format("YYYY-MM-DD");

    validateFromDate(lastDateFormatted);

    console.log("Updating vouchers from", lastDateFormatted);

    const refresh_token = await clerkClient.users.getUserOauthAccessToken(
      identity.subject,
      "oauth_google",
    );
    const [token] = refresh_token.data;

    const auth = google.auth.fromJSON({
      type: "authorized_user",
      client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      refresh_token: token.token,
    });

    //@ts-ignore
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.list({
      userId: "me",
      q: `noreply@notifications.pluxee.co.il after:${lastDateFormatted}`,
    });

    const messages = res.data.messages || [];

    for (const message of messages.reverse()) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id || "",
      });

      console.log("Processing message", msg.data.snippet);

      await processMessage(ctx, msg.data, gmail, identity.subject);
    }
  },
});