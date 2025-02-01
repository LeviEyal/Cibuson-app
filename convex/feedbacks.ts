import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import {emailsAddresses} from "../constants/emails";
import { rateLimiter } from "./rateLimiter";

export const sendFeedback = action({
    args: {
        message: v.string(),
    },
    handler: async (ctx, { message }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error("Unauthorized");
        }

        const {ok, retryAfter} = await rateLimiter.limit(ctx, "sendFeedback", {
          key: identity.subject,
        });

        if (!ok) {
          throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
        }

        await ctx.runAction(internal.googleAPI.emailService.sendEmail, {
            to: emailsAddresses.MANAGER_EMAIL,
            subject: `Cibuson / New Feedback - ${identity.email}`,
            text: `From: ${identity.emailS} \n\n${message}`,
        });
    }
});