import { v } from "convex/values";

export const cibusVoucherValidator = {
  date: v.number(),
  amount: v.number(),
  url: v.optional(v.string()),
  gif: v.optional(v.string()),
  barcodeNumber: v.optional(v.string()),
  dateUsed: v.optional(v.string()),
  isBugged: v.optional(v.boolean()),
  userId: v.string(),
  provider: v.union(v.literal("cibus"), v.literal("tenbis")),
} as const; 