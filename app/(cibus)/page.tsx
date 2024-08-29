"use client";

import { useAuth } from "@clerk/nextjs";

import { VouchersList } from "./VouchersList";

export default function Page() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div>
        <p className="text-center text-3xl text-pretty">טוען...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div>
        <p className="text-center text-3xl text-pretty">
          אנא התחבר כדי לראות את השוברים שלך.
        </p>
      </div>
    );
  }

  return <VouchersList />;
}
