import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  lesson: defineTable({
    studentName: v.string(),
    date: v.number(),
    duration: v.number(),
    price: v.number(),
    paid: v.boolean(),
    user: v.optional(v.string()),
  }),
});