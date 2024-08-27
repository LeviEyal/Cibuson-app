import { BsClipboard2CheckFill, BsClipboardCheck } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

import type { Doc, Id } from "@/convex/_generated/dataModel";

interface GroceryItemProps {
  item: Doc<"groceries">;
  onToggle: (id: Id<"groceries">) => Promise<null>;
  onRemove: (id: Id<"groceries">) => Promise<null>;
}

export const GroceryItem = ({ item, onToggle, onRemove }: GroceryItemProps) => {
  return (
    <li className="flex justify-between items-center p-2 border-b border-gray-200">
      <span>{item.name}</span>

      {/* Item Actions */}
      <div className="flex gap-2">
        <button onClick={() => onToggle(item._id)}>
          {item.marked ? (
            <BsClipboard2CheckFill className="text-pink-700 size-6" />
          ) : (
            <BsClipboardCheck className="size-5" />
          )}
        </button>
        <button onClick={() => onRemove(item._id)}>
          <MdDeleteOutline className="size-6" />
        </button>
      </div>
    </li>
  );
};
