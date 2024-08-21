import { v } from "convex/values";

import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "../_generated/server";

export const internalGetAllVouchers = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("cibusVouchers").collect();
  },
});

export const allVouchers = query({
  args: {
    filter: v.optional(
      v.union(v.literal("used"), v.literal("unused"), v.literal("all")),
    ),
  },
  handler: async (ctx, { filter }) => {
    const vouchers = await ctx.db
      .query("cibusVouchers")
      .filter((q) => {
        if (filter === "used") {
          return q.not(q.eq(q.field("dateUsed"), undefined));
        }
        if (filter === "unused") {
          return q.eq(q.field("dateUsed"), undefined);
        }
        return true;
      })
      .collect();
    return vouchers.sort((a, b) => b.date - a.date);
  },
});

export const addVouchers = internalMutation({
  args: {
    vouchers: v.array(
      v.object({
        date: v.number(),
        amount: v.number(),
        url: v.string(),
        dateUsed: v.optional(v.string()),
        gif: v.string(),
        barcodeNumber: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, { vouchers }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    for (const voucher of vouchers) {
      const existing = await ctx.db
        .query("cibusVouchers")
        .filter((q) => q.eq(q.field("url"), voucher.url))
        .collect();
      if (existing.length > 0) {
        continue;
      }
      await ctx.db.insert("cibusVouchers", voucher);
    }
  },
});

export const markVoucherAsUsed = mutation({
  args: {
    voucherId: v.id("cibusVouchers"),
  },
  handler: async (ctx, { voucherId }) => {
    await ctx.db.patch(voucherId, { dateUsed: new Date().toISOString() });
  },
});

export const unmarkVoucherAsUsed = mutation({
  args: {
    voucherId: v.id("cibusVouchers"),
  },
  handler: async (ctx, { voucherId }) => {
    await ctx.db.patch(voucherId, { dateUsed: undefined });
  },
});