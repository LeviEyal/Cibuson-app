import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import {emailsAddresses} from "../constants/emails";

export const sendFeedback = action({
    args: {
        name: v.string(),
        message: v.string(),
    },
    handler: async (ctx, { name, message }) => {
        await ctx.runAction(internal.googleAPI.emailService.sendEmail, {
            to: emailsAddresses.MANAGER_EMAIL,
            subject: `Cibuson / New Feedback - ${name}`,
            text: `From: ${name} \n\n${message}`,
        });
    }
});