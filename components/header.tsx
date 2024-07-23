"use client";

import { Menu } from "@/app/lessons/Menu";
import { NewLessonForm } from "@/app/lessons/NewLessonForm";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="h-20 z-40 flex justify-around items-center bg-slate-400 sticky top-0">
      <Menu />
      <div className="flex items-center">
        <h1 className="text-center text-2xl">אפליקציה למאמיש</h1>
        <Image src="/cat.png" width={50} height={50} alt="logo" />
      </div>
      <NewLessonForm />

      <div>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};
