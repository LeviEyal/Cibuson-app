import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

import type { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface GroceryItemProps {
  item: Doc<"groceries">;
  onToggle: (id: Id<"groceries">) => Promise<null>;
  onRemove: (id: Id<"groceries">) => Promise<null>;
}

export const GroceryItem = ({ item, onToggle, onRemove }: GroceryItemProps) => {
  return (
    <li className="flex justify-between items-center p-2 border-b border-gray-200">
      <div className="flex gap-2"  onClick={() => onToggle(item._id)}>
        <button>
          {item.marked ? (
            <MdOutlineCheckBox className="text-pink-700 size-5" />
          ) : (
            <MdOutlineCheckBoxOutlineBlank className="size-5" />
          )}
        </button>
        <span
          className={cn("text-lg", item.marked && "line-through text-gray-400")}
        >
          {item.name}
        </span>
      </div>

      {/* Item Actions */}
      <div className="flex gap-2">
        <button onClick={() => onRemove(item._id)}>
          <MdDeleteOutline className="size-6 text-red-600" />
        </button>
      </div>
    </li>
  );
};
