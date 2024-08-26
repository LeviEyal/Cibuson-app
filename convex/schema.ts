import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const cibusVouchers = defineTable({
  date: v.number(),
  amount: v.number(),
  url: v.string(),
  gif: v.string(),
  barcodeNumber: v.optional(v.string()),
  dateUsed: v.optional(v.string()),
  isBugged: v.optional(v.boolean()),
  userId: v.string(),
  provider: v.union(v.literal("cibus"), v.literal("tenbis")),
})
  .index("by_userId_date", ["userId", "date"])

/**
 * The schema is entirely optional.
 * You can delete this file (schema.ts) and the
 * app will continue to work.
 * The schema provides more precise TypeScript types.
 */
export default defineSchema({
  groceries: defineTable({
    name: v.string(),
    category: v.string(),
    user: v.optional(v.string()),
  }),
  cibusVouchers,
});
