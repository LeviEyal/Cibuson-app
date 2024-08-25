"use client";

import { HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const items = [{ name: "ניהול תלמידים", icon: PersonIcon }];

export const Menu = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <HamburgerMenuIcon width={25} height={25} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>תפריט</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3"
            >
              <item.icon />
              <SheetDescription>{item.name}</SheetDescription>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
