"use node";

import { v } from "convex/values";
import OpenAI from "openai";

import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { action } from "./_generated/server";

const shoppingListPrompt = async (
  groceriesRaw: string,
  currentGroceries: Doc<"groceries">[],
) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `you are a shopping list bot. you need to generate a shopping list from the given groceries string containing groceries in hebrew`,
      },
      {
        role: "system",
        content:
          'response in JSON format: [{"category": "category name in hebrew", "name": "item name in hebrew"]',
      },
      {
        role: "system",
        content: "sanitize the response, no escaping characters or spaces",
      },
      { role: "system", content: "no need for wrapping in markdown" },
      {
        role: "user",
        content: `Don't include items that are already in the list: ${currentGroceries}`,
      },
      {
        role: "system",
        content:
          " הקטגוריות הן: ירקות ופירות, לחמים ומאפים, מוצרי בשר ועוף, מוצרי דגים, טיפוח והיגיינה, מוצרי חלב, כללי, שימורים, טואלטיקה, אלבוהול, חטיפים וממתקים, מוצרי אפייה, מחלקת קפואים, תבלינים, יבשים, חומרי ניקוי וחד פעמי",
      },
      { role: "user", content: groceriesRaw },
    ],
    model: "gpt-4o-mini",
  });
  return chatCompletion.choices[0].message.content;
};

/**
 * Generate a shopping list from the given groceries string containing groceries in hebrew
 */
export const generateShoppingList = action({
  args: { groceriesRaw: v.string() },
  handler: async (ctx, { groceriesRaw }) => {
    const currentGroceries = await ctx.runQuery(
      internal.groceries.readData,
      {},
    );

    let newGroceries = await shoppingListPrompt(groceriesRaw, currentGroceries);
    if (!newGroceries) return;

    const obj = JSON.parse(newGroceries);

    await ctx.runMutation(internal.groceries.insertData, { data: obj });

    return newGroceries;
  },
});
