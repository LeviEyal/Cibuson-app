"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  MdAddShoppingCart,
  MdDeleteForever,
  MdOutlineRemoveShoppingCart,
} from "react-icons/md";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { GroceryItem } from "./GroceryItem";
import { Textarea } from "@/components/ui/textarea";

export default function ShoppingListPage() {
  const generateShoppingList = useAction(api.shoppingList.generateShoppingList);
  const toggleGroceryItem = useMutation(api.groceries.toggleGroceryItem);
  const removeGroceryItem = useMutation(api.groceries.removeGroceryItem);
  const removeMarkedGroceries = useMutation(
    api.groceries.removeMarkedGroceries,
  );
  const deleteAllItems = useMutation(api.groceries.deleteAllItems);

  const items = useQuery(api.groceries.groceries);
  const groceriesRawInputRef = useRef<HTMLTextAreaElement>(null);
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
    <PageContainer className="px-5">
      <h1 className="text-2xl">רשימת קניות חכמה</h1>
      <form
        className="w-full flex flex-col justify-center items-center gap-4"
        onSubmit={handleGenerateShoppingList}
      >
        <Textarea
          className="align-text-top text-start w-full h-16 border border-pink-700 rounded-lg text-pink-700 text-md focus:ring-0 active:ring-0 outline-none px-4"
          ref={groceriesRawInputRef}
          placeholder="הוסף מצרכים בשפה חופשית מופרדים בפסיק..."
          maxLength={50}
        />
        <div className="w-full flex gap-1 justify-center">
          <Button
            type="submit"
            className="flex items-center gap-2 rounded-l-none w-1/3"
            disabled={loading}
            key={loading ? "loading" : "idle"}
          >
            {loading ? "מוסיף..." : "הוסף לרשימה"}
            <MdAddShoppingCart className="size-3" />
          </Button>
          <Button
            type="button"
            className="flex items-center gap-1 rounded-none w-1/3"
            onClick={() => removeMarkedGroceries()}
          >
            נקה מסומנים
            <MdOutlineRemoveShoppingCart className="size-3" />
          </Button>
          <Button
            type="button"
            className="flex items-center gap-2 rounded-r-none w-1/3"
            variant="cibusDestructive"
            onClick={() => deleteAllItems()}
          >
            נקה רשימה
            <MdDeleteForever className="size-3" />
          </Button>
        </div>
      </form>
      {items?.length ? (
        <div className="w-full mt-3">
          <AnimatePresence initial={false}>
            {items.map((category) => (
              <div key={category.category}>
                <h2 className="font-semibold my-1">{category.category}</h2>
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
      ) : (
        <EmptyState
          className="mt-16"
          image="/assets/shopping-list-empty-state.png"
          title="רשימת הקניות ריקה"
          description="הוסיפו מצרכים לרשימה והם יופיעו כאן עם אפשרות לסימון ומחיקה"
        />
      )}
    </PageContainer>
  );
}
