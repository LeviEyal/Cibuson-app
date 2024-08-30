"use client";

import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export const Header = () => {
  return (
    <header
      className="fixed left-auto top-0 z-40 flex h-20 max-w-[500px] w-full items-center justify-between px-2 text-white shadow"
      style={{
        backgroundImage:
          "url(data:image/gif;base64,R0lGODdhWAICAMIFAM0Mg9ojd+g3bPNKYP9cWv///////////ywAAAAAWAICAAADVwi63P4wykmrvSHrzbv/YCiOZGkKaKqubOu+cCzPdD3ceK7vfO//wKBwSCQYj8ikcslsOp/QqHR6qVqv2CzGxO16v+BSbUwum882onrNbruH07h8Tq9PEwA7)",
      }}
    >
      {/* Right section */}
      <section className="flex items-center gap-3">
        <Image
          src="/logo1.jpg"
          width={60}
          height={60}
          className="rounded-xl"
          alt="logo"
        />
        <div className="flex flex-col items-start justify-center -space-y-1">
          <h1 className="text-center text-3xl font-semibold">Cibuson</h1>
          <h2 className="text-sm text-center">
            ניהול שוברים מהסיבוס ומהתן ביס
          </h2>
        </div>
      </section>

      {/* Left section */}
      <section className="flex items-center justify-center gap-1">
        <div className="flex items-center ml-3">
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
            {/* <OrganizationSwitcher
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
            /> */}
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="rounded border border-gray-400 px-3 py-0.5">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>
    </header>
  );
};
