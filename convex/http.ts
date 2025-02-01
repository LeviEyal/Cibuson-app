import { httpRouter } from "convex/server";

import { emailsAddresses } from "../constants/emails";
import { newUserNotificationTemplate } from "../lib/emails/new-user-notification";
import { ClerkUserCreatedEvent } from "../types/clerk-user-created-event-type";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const api = httpRouter();

const handleClerkUserCreatedWebhook = httpAction(async (ctx, request) => {
  const body = (await request.json()) as ClerkUserCreatedEvent;
  console.log("Received Clerk webhook event", body);

  const customizedEmail = newUserNotificationTemplate(body);
  await ctx.runAction(internal.googleAPI.emailService.sendEmail, {
    to: emailsAddresses.MANAGER_EMAIL,
    subject: `Cibuson / New user registration (${body.data.email_addresses[0].email_address})`,
    html: customizedEmail,
  });

  return new Response("Webhook handled", { status: 200 });
});

api.route({
  path: "/api/clerk/webhook/user-created",
  method: "POST",
  handler: handleClerkUserCreatedWebhook,
});

export default api;
