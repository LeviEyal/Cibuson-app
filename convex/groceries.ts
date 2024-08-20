import { v } from "convex/values";

import { internalMutation, internalQuery, query } from "./_generated/server";

export const readData = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("groceries").collect();
  },
});

export const groceries = query({
  args: {},
  handler: async (ctx) => {
    const ans: Record<string, any[]> = {};
    const data = await ctx.db.query("groceries").collect();
    data.forEach((item) => {
      if (!ans[item.category]) ans[item.category] = [];
      ans[item.category].push(item);
    });
    return ans;
  },
});

export const insertData = internalMutation({
  args: { data: v.array(v.any()) },
  handler: async (ctx, { data }) => {
    data.forEach(async (item) => {
      await ctx.db.insert("groceries", item);
    });
  },
});
