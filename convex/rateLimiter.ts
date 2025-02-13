import RateLimiter, { MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

/**
 * A central rate limiter for the entire app.
 */
export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Allows up to 3 in quick succession if they haven't sent many recently.
  sendMessage: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
  updateCibusVouchers: { kind: "fixed window", rate: 10, period: MINUTE },
  sendFeedback: { kind: "fixed window", rate: 1, period: MINUTE },
});