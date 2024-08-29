'use client';

import { CalculatorIcon, HomeIcon, ListCheckIcon, LucideGroup, Users2Icon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface MenuItemProps {
  title: string;
  link: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export const MenuItem = ({
  title,
  link,
  icon,
  isActive = false,
}: MenuItemProps) => {
  return (
    <Link
      href={link}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full p-2",
        isActive && "bg-black/20",
      )}
    >
      {icon}
      <span className="text-xs">{title}</span>
    </Link>
  );
};

export const AppFooter = () => {
  const pathname = usePathname();

  return (
    <footer className="gap-3 absolute left-0 bottom-0 z-40 flex h-16 w-full items-center justify-evenly bg-pink-600 shadow text-white">
      <MenuItem
        title="דף הבית"
        link="/"
        icon={<HomeIcon />}
        isActive={pathname === "/"}
      />
      <MenuItem
        title="מחשבון"
        link="/calculator"
        isActive={pathname === "/calculator"}
        icon={<CalculatorIcon />}
      />
      <MenuItem
        title="רשימת קניות"
        link="/shopping-list"
        isActive={pathname === "/shopping-list"}
        icon={<ListCheckIcon />}
      />
      <MenuItem
        title="קבוצות"
        link="/about"
        isActive={pathname === "/about"}
        icon={<Users2Icon />}
      />
    </footer>
  );
};
