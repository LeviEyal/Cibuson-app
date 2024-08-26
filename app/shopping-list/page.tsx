"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { GroceryItem } from "./GroceryItem";

export default function ShoppingListPage() {
  const generateShoppingList = useAction(api.shoppingList.generateShoppingList);
  const toggleGroceryItem = useMutation(api.groceries.toggleGroceryItem);
  const removeGroceryItem = useMutation(api.groceries.removeGroceryItem);
  const removeMarkedGroceries = useMutation(api.groceries.removeMarkedGroceries);

  const items = useQuery(api.groceries.groceries);
  const groceriesRawInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateShoppingList = async (event: React.FormEvent) => {
    event.preventDefault();

    if (groceriesRawInputRef.current) {
      setLoading(true);
      const groceriesRaw = groceriesRawInputRef.current.value;
      groceriesRawInputRef.current.value = "";
      groceriesRawInputRef.current.focus();
      try {
        const response = await generateShoppingList({ groceriesRaw });
        console.log(response);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full px-8 mt-5 mb-20 flex flex-col justify-start items-center gap-2">
      <h1>רשימת קניות חכמה</h1>
      <form
        className="w-full flex flex-col justify-center items-center gap-3"
        onSubmit={handleGenerateShoppingList}
      >
        <Input
          className="w-full h-16 border border-pink-700 rounded-lg text-pink-700 text-lg focus:ring-0 active:ring-0 outline-none px-4"
          ref={groceriesRawInputRef}
          placeholder="הוסף מצרכים בשפה חופשית..."
        />
        <div className="w-full flex gap-2 justify-center">
          <Button type="submit" disabled={loading}>הוסף לרשימה</Button>
          <Button type="button" variant="cibusDestructive">
            נקה רשימה
          </Button>
          <Button type="button" onClick={() => removeMarkedGroceries()}>נקה מסומנים</Button>
        </div>
      </form>
      {items && (
        <div className="w-full">
          <AnimatePresence initial={false}>
            {items.map((category) => (
              <div key={category.category}>
                <h2 className="font-semibold">{category.category}</h2>
                {category.items.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ height: 0, scale: 0 }}
                    animate={{ height: "auto", scale: 1 }}
                    exit={{ height: 0, scale: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <GroceryItem
                      key={item._id}
                      item={item}
                      onRemove={(id: Id<"groceries">) =>
                        removeGroceryItem({ id })
                      }
                      onToggle={(id: Id<"groceries">) =>
                        toggleGroceryItem({ id })
                      }
                    />
                  </motion.div>
                ))}
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
