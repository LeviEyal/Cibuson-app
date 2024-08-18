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
    <header className="text-white h-20 z-40 flex justify-between px-4 items-center bg-gradient-to-b from-pink-800 to-pink-600 fixed top-0 left-0 w-full">
      <div className="flex justify-center items-center gap-2">
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
                  width: "30px",
                  height: "30px",
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
        <h1 className="text-center text-3xl font-semibold">Cibuson</h1>
        <Image src="/logo1.jpg" width={70} height={70} className="rounded-3xl" alt="logo" />
      </div>
    </header>
  );
};
