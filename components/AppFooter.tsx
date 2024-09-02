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
        isActive && "text-pink-600",
      )}
    >
      {icon}
      <span className="sm:text-sm text-xs">{title}</span>
    </Link>
  );
};

export const AppFooter = () => {
  const pathname = usePathname();

  return (
    <footer className="gap-3 fixed left-auto bottom-0 z-40 flex h-20 max-w-2xl w-full items-center justify-evenly bg-white shadow-t-md text-black font-medium">
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
