import { v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

/**
 * Reads all data from the "groceries" table.
 */
export const readData = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("groceries").collect();
  },
});

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const data = await ctx.db
      .query("groceries")
      .withIndex("by_user", (q) => q.eq("user", identity.subject))
      .collect();
      
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

/**
 * Marks or unmarks a grocery item for the authenticated user
 */
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

/**
 * Removes a grocery item from the list for the authenticated user.
 */
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

/**
 * Removes all marked groceries for the authenticated user.
 */
export const removeMarkedGroceries = mutation({
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

/**
 * Inserts data into the "groceries" table for the authenticated user.
 */
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

/**
 * Deletes all data from the "groceries" table for the authenticated user.
 */
export const deleteAllItems = mutation({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const items = await ctx.db
      .query("groceries")
      .withIndex("by_user", (q) => q.eq("user", user.subject))
      .collect();

    items.forEach(async (item) => {
      await ctx.db.delete(item._id);
    });
  },
});
