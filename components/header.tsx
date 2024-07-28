"use client";

import { Menu } from "@/app/lessons/Menu";
import { NewLessonForm } from "@/app/lessons/NewLessonForm";
import {
  CreateOrganization,
  OrganizationProfile,
  OrganizationSwitcher,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="h-20 z-40 flex justify-between px-4 items-center bg-slate-400 fixed top-0 left-0 w-full">
      <div className="flex justify-center items-center gap-3">
        <Menu />

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarImage: {
                  width: "35px",
                  height: "35px",
                },
                userButtonAvatarBox: {
                  width: "35px",
                  height: "35px",
                },
              },
            }}
          />
          <OrganizationSwitcher 
            appearance={{
              elements: {
                organizationPreviewAvatarBox: {
                  width: "35px",
                  height: "35px",
                },
                organizationPreviewMainIdentifier: {
                  display: "none",
                },
                organizationSwitcherTriggerIcon: {
                  display: "none",
                },
              },
            }}
          />
        </SignedIn>
      </div>

      <div className="flex items-center gap-3">
        <h1 className="text-center text-3xl">Mamish.io</h1>
        <Image src="/cat.png" width={50} height={50} alt="logo" />
      </div>
    </header>
  );
};
