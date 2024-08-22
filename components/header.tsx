"use client";

import {
  CreateOrganization,
  OrganizationProfile,
  OrganizationSwitcher,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

import { Menu } from "@/app/lessons/Menu";

export const Header = () => {
  return (
    <header
      className="fixed left-0 top-0 z-40 flex h-20 w-full items-center justify-between px-2 text-white shadow"
      style={{
        backgroundImage:
          "url(data:image/gif;base64,R0lGODdhWAICAMIFAM0Mg9ojd+g3bPNKYP9cWv///////////ywAAAAAWAICAAADVwi63P4wykmrvSHrzbv/YCiOZGkKaKqubOu+cCzPdD3ceK7vfO//wKBwSCQYj8ikcslsOp/QqHR6qVqv2CzGxO16v+BSbUwum882onrNbruH07h8Tq9PEwA7)",
      }}
    >
      <div className="flex items-center justify-center gap-1">
        <Menu />

        <div className="flex items-center ms-2">
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
                  userPreviewTextContainer: {
                    display: "none",
                  },
                  organizationSwitcherTriggerIcon: {
                    display: "none",
                  },
                  organizationPreviewMainIdentifier: {
                    display: "none",
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end justify-center -space-y-1">
          <h1 className="text-center text-3xl font-semibold">Cibuson</h1>
          {/* <h2 className="text-sm text-center">ניהול שוברים מהסיבוס ומהתן ביס</h2> */}
          {/* <h2 className="text-md text-center">Cibus & 10bis Vouchers</h2> */}
          <h2 className="text-md text-center">שוברים מסיבוס ותן ביס</h2>
        </div>
        <Image
          src="/logo1.jpg"
          width={60}
          height={60}
          className="rounded-xl"
          alt="logo"
        />
      </div>
    </header>
  );
};
