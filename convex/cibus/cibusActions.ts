"use node";

import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { google } from "googleapis";
import type { Doc } from "../_generated/dataModel";
const { htmlToText } = require("html-to-text");
import { clerkClient } from "@clerk/clerk-sdk-node";

function extractPluxeeUrls(text: string): string | null {
  const regex = /https:\/\/myconsumers\.pluxee\.co\.il\/b\?[^ \]\n]+/g;
  const matche = text.match(regex);
  return matche ? matche[0] : null;
}

function extractEmployerContribution(text: string): string | null {
  const regex = /השתתפות מקום העבודה: ₪([\d,.]+)/;
  const match = text.match(regex);
  return match ? match[1] : null;
}

// date should be in the format of YYYY-MM-DD
function validateFromDate(fromDate: string) {
  if (!fromDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error("Invalid date format");
  }
}

type NewVoucher = Pick<Doc<"cibusVouchers">, "amount" | "url" | "date" | "gif">;

export const updateCibusVouchers = action({
  args: {
    fromDate: v.string(),
  },
  handler: async (ctx, { fromDate }) => {
    validateFromDate(fromDate);
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const refresh_token = await clerkClient.users.getUserOauthAccessToken(
      identity.subject,
      "oauth_google",
    );
    const [token] = refresh_token.data;

    console.log({ token });

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
      // q: `noreply@notifications.pluxee.co.il after:${date} subject:${title}`,
      q: `noreply@notifications.pluxee.co.il after:${fromDate}`,
    });

    const messages = res.data.messages || [];
    const newVouchers: NewVoucher[] = [];

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id || "",
      });

      const parts = msg.data.payload?.parts || [];
      const newVoucher = {} as NewVoucher;

      for (const part of parts) {
        if (part.mimeType === "image/gif") {
          const attachmentId = part.body?.attachmentId;
          if (!attachmentId) continue;
          const attachment = await gmail.users.messages.attachments.get({
            userId: "me",
            messageId: message.id || "",
            id: attachmentId,
          });
          const data = attachment.data.data || "";
          newVoucher.gif = `data:image/gif;base64,${data}`;
          console.log({ data });
        } else if (part.mimeType === "text/html") {
          const data = part.body?.data || "";
          const htmlContent = Buffer.from(data, "base64").toString("utf8");

          // Convert HTML to text
          const text: string = htmlToText(htmlContent, {
            wordwrap: 130,
          });
          newVoucher.url = extractPluxeeUrls(text) || "";
          newVoucher.amount = Number(extractEmployerContribution(text));
        }
      }
      if (newVoucher.url && newVoucher.amount && newVoucher.gif) {
        newVouchers.push({
          url: newVoucher.url,
          amount: newVoucher.amount,
          gif: newVoucher.gif,
          date: Number.parseInt(msg.data.internalDate as string),
        });
      }
    }

    if (!newVouchers) return;
    await ctx.runMutation(internal.cibus.cibusQueries.addVouchers, {
      vouchers: newVouchers,
    });
    return { newVouchers };
  },
});
