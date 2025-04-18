import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import type { Id } from "../_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "../_generated/server";
import { cibusVoucherValidator } from "../validators";

export const allVouchers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    filter: v.optional(
      v.union(
        v.literal("used"),
        v.literal("unused"),
        v.literal("bugged"),
        v.literal("all"),
      ),
    ),
  },
  handler: async (ctx, { filter, paginationOpts }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity?.subject;

    const vouchers = await ctx.db
      .query("cibusVouchers")
      .withIndex("by_userId_date", (q) => q.eq("userId", userId))
      .order("desc")
      .filter((q) => {
        if (filter === "used") {
          return q.not(q.eq(q.field("dateUsed"), undefined));
        }
        if (filter === "unused") {
          return q.eq(q.field("dateUsed"), undefined);
        }
        if (filter === "bugged") {
          return q.not(q.eq(q.field("isBugged"), undefined));
        }
        return true;
      })
      .paginate(paginationOpts);
    return vouchers;
  },
});

export const allVouchersAggregated = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity?.subject;

    const vouchers = await ctx.db
      .query("cibusVouchers")
      .withIndex("by_userId_date", (q) => q.eq("userId", userId))
      .collect();

    let totalUnusedAmount = 0,
      totalUsedAmount = 0,
      totalBuggedAmount = 0,
      totalUnusedCount = 0,
      totalUsedCount = 0,
      totalBuggedCount = 0;

    for (const voucher of vouchers) {
      if (voucher.dateUsed) {
        totalUsedAmount += voucher.amount;
        totalUsedCount++;
      } else if (voucher.isBugged) {
        totalBuggedAmount += voucher.amount;
        totalBuggedCount++;
      } else {
        totalUnusedAmount += voucher.amount;
        totalUnusedCount++;
      }
    }

    return {
      totalUnusedAmount,
      totalUsedAmount,
      totalBuggedAmount,
      totalUnusedCount,
      totalUsedCount,
      totalBuggedCount,
    };
  },
});

export const addVouchers = internalMutation({
  args: {
    vouchers: v.array(
      v.object(cibusVoucherValidator),
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
        .filter((q) => q.eq(q.field("barcodeNumber"), voucher.barcodeNumber))
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

export const markBuggedVoucher = mutation({
  args: {
    voucherId: v.id("cibusVouchers"),
  },
  handler: async (ctx, { voucherId }) => {
    await ctx.db.patch(voucherId, { isBugged: true });
  },
});

export const unmarkBuggedVoucher = mutation({
  args: {
    voucherId: v.id("cibusVouchers"),
  },
  handler: async (ctx, { voucherId }) => {
    await ctx.db.patch(voucherId, { isBugged: false });
  },
});

export const calculateBestVouchers = mutation({
  args: { purchaseSum: v.number() },
  handler: async (ctx, { purchaseSum }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;

    const vouchers = await ctx.db
      .query("cibusVouchers")
      .withIndex("by_userId_amount", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("dateUsed"), undefined),
          q.not(q.eq(q.field("isBugged"), true)),
        ),
      )
      .order("desc")
      .collect();

    let remainingSum = purchaseSum;
    const vouchersToUse: Id<"cibusVouchers">[] = [];

    for (const voucher of vouchers) {
      if (voucher.amount <= remainingSum) {
        vouchersToUse.push(voucher._id);
        remainingSum -= voucher.amount;
      }
    }

    return {
      vouchersToUse,
      remainingToPayWithCard: remainingSum,
    };
  },
});

export const vouchersByIds = query({
  args: { ids: v.array(v.id("cibusVouchers")) },
  handler: async (ctx, { ids }) => {
    const vouchers = await Promise.all(ids.map((id) => ctx.db.get(id)));

    const filtered = vouchers.filter((item) => item !== null);

    return filtered.filter((item) => !item.dateUsed && !item.isBugged);
  },
});

export const getLastUserVoucherDate = internalQuery({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const vouchers = await ctx.db
      .query("cibusVouchers")
      .withIndex("by_userId_date", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(1)

    return vouchers[0]?.date || 0;
  },
});
