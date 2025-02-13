"use node";

import { clerkClient } from "@clerk/clerk-sdk-node";
import { v } from "convex/values";
import { type gmail_v1, google } from "googleapis";

import { internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { action } from "../_generated/server";
import { rateLimiter } from "../rateLimiter";

const { htmlToText } = require("html-to-text");

// find the first 18-21 digits number in the text
function extractBarcodeNumber(text: string): string | null {
  const regex = /\d{17,23}/g;
  const match = text.match(regex);
  return match ? match[0] : null;
}

function extractPluxeeUrls(text: string): string | null {
  const regex1 = /https:\/\/u45438565.ct.sendgrid.net[^ \]\n]+/g;
  const regex2 = /https:\/\/myconsumers\.pluxee\.co\.il\/b\?[^ \]\n]+/g;
  const match = text.match(regex1) || text.match(regex2);

  return match ? match[0] : null;
}

function extractEmployerContribution(text: string): string | null {
  const regex = /החיוב בסיבוס שלך:\n₪([\d,.]+)/;
  const match = text.match(regex);
  return match ? match[1] : null;
}

// date should be in the format of YYYY-MM-DD
function validateFromDate(fromDate: string) {
  if (!fromDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error("Invalid date format");
  }
}

type NewVoucher = Omit<Doc<"cibusVouchers">, "_id" | "_creationTime">;

async function processMessage(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
      
      const text: string = htmlToText(htmlContent, {
        wordwrap: 130,
      });
      
      console.log({text});
      
      
      newVoucher.url = extractPluxeeUrls(text) || "";
      newVoucher.amount = Number(extractEmployerContribution(text));
      newVoucher.barcodeNumber = extractBarcodeNumber(text) || "";
    }
  }

  console.log({newVoucher});

  if (newVoucher.url && newVoucher.amount) {
    const toInsert = {
      userId,
      url: newVoucher.url,
      amount: newVoucher.amount,
      gif: newVoucher.gif,
      date: Number.parseInt(message.internalDate as string),
      barcodeNumber: newVoucher.barcodeNumber,
      provider: "cibus",
    };

    await ctx.runMutation(internal.cibus.cibusQueries.addVouchers, {
      vouchers: [toInsert],
    });
  }
}



export const updateCibusVouchers = action({
  args: {
    fromDate: v.string(),
  },
  handler: async (ctx, { fromDate }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const {ok, retryAfter} = await rateLimiter.limit(ctx, "updateCibusVouchers", {
      key: identity.subject,
    });

    if (!ok) {
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }

    validateFromDate(fromDate);

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
      q: `noreply@notifications.pluxee.co.il after:${fromDate}`,
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
