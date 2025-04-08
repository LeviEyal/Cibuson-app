import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { cibusVoucherValidator } from "./validators";

export const cibusVouchers = defineTable(cibusVoucherValidator)
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
