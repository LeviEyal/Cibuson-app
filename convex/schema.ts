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
  .index("by_userId", ["userId"])
  .index("by_userId_amount", ["userId", "amount"]);

export const groceries = defineTable({
  name: v.string(),
  category: v.string(),
  user: v.string(),
  marked: v.optional(v.boolean()),
}).index("by_user", ["user"]);

export default defineSchema({
  groceries,
  cibusVouchers,
});
