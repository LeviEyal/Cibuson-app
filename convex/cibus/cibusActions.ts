"use node";

import { clerkClient } from "@clerk/clerk-sdk-node";
import { v } from "convex/values";
import { google } from "googleapis";

import { internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { action } from "../_generated/server";

const { htmlToText } = require("html-to-text");

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
    orgId: v.string(),
    fromDate: v.string(),
  },
  handler: async (ctx, { fromDate, orgId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
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

          // Convert HTML to text
          const text: string = htmlToText(htmlContent, {
            wordwrap: 130,
          });
          newVoucher.url = extractPluxeeUrls(text) || "";
          newVoucher.amount = Number(extractEmployerContribution(text));
        }
      }
      if (newVoucher.url && newVoucher.amount) {
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
      orgId
    });
    return { newVouchers };
  },
});
