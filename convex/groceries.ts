import { v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

export const readData = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("groceries").collect();
  },
});

// type GroceryItem = {
//   _id:

//   name: string;
//   category: string;
//   marked: boolean;
//   user: string;
// };

type ShoppingList = {
  category: string;
  items: Doc<"groceries">[];
}[];

/**
 * Return the shopping list in a grouped format:
 * [
 *  {
 *    category: "category name",
 *    items: [
 *      {
 *        name: "item name",
 *        marked: true/false,
 *        user: "user
 *      },
 *      ...
 *    ]
 *  },
 * ...
 * ]
 */
export const groceries = query({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.db.query("groceries").collect();
    const ans: ShoppingList = [];

    data.forEach((item) => {
      const category = ans.find((c) => c.category === item.category);
      if (category) {
        category.items.push(item);
      } else {
        ans.push({
          category: item.category,
          items: [item],
        });
      }
    });

    return ans;
  },
});

export const toggleGroceryItem = mutation({
  args: { id: v.id("groceries") },
  handler: async (ctx, { id }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const item = await ctx.db.get(id);

    if (item?.user !== user.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { marked: !item.marked });
  },
});

export const removeGroceryItem = mutation({
  args: { id: v.id("groceries") },
  handler: async (ctx, { id }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const item = await ctx.db.get(id);

    if (item?.user !== user.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(id);

    return null;
  },
});

export const removeMarkedGroceries = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const items = await ctx.db
      .query("groceries")
      .withIndex("by_user", (q) => q.eq("user", user.subject))
      .filter((q) => q.eq(q.field("marked"), true))
      .collect();

    items.forEach(async (item) => {
      await ctx.db.delete(item._id);
    });
  },
});

export const insertData = internalMutation({
  args: { data: v.array(v.any()) },
  handler: async (ctx, { data }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    data.forEach(async (item) => {
      await ctx.db.insert("groceries", { ...item, user: user.subject });
    });
  },
});
