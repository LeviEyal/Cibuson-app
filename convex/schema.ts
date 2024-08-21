import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * The schema is entirely optional.
 * You can delete this file (schema.ts) and the
 * app will continue to work.
 * The schema provides more precise TypeScript types.
 */
export default defineSchema({
  lesson: defineTable({
    studentName: v.string(),
    date: v.number(),
    duration: v.number(),
    price: v.number(),
    paid: v.boolean(),
    user: v.optional(v.string()),
    orgId: v.optional(v.string()),
  }),
  groceries: defineTable({
    name: v.string(),
    category: v.string(),
    user: v.optional(v.string()),
  }),
  cibusVouchers: defineTable({
    date: v.number(),
    amount: v.number(),
    url: v.string(),
    gif: v.string(),
    barcodeNumber: v.optional(v.string()),
    dateUsed: v.optional(v.string()),
    userId: v.optional(v.string()),
    provider: v.optional(v.union(v.literal("cibus"), v.literal("tenbis"))),
  }),
});
