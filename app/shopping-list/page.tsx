"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useRef } from "react";

export default function ShoppingListPage() {
  const generateShoppingList = useAction(api.shoppingList.generateShoppingList);
  const groceriesRawInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateShoppingList = async () => {
    if (groceriesRawInputRef.current) {
      const groceriesRaw = groceriesRawInputRef.current.value;
      const response = await generateShoppingList({ groceriesRaw });
      console.log(response);
    }
  };

  return (
    <div>
      <h1>Shopping List</h1>
      <input ref={groceriesRawInputRef} placeholder="Groceries" />
      <button onClick={handleGenerateShoppingList}>
        Generate Shopping List
      </button>
    </div>
  );
}
