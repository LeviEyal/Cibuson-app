"use client";

import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { VoucherCard } from "./VoucherCard";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";

export default function Page() {
  const vouchers = useQuery(api.cibus.cibusQueries.allVouchers, {});
  const [collapsed, setCollapsed] = useState<Id<"cibusVouchers"> | null>(null);
  const updateCibusVouchers = useAction(
    api.cibus.cibusActions.updateCibusVouchers,
  );

  const totalUnusedAmount = vouchers
    ?.filter((v) => !v.dateUsed)
    .reduce((acc, v) => acc + v.amount, 0);

  const refresh = async () => {
    try {
      await updateCibusVouchers({ fromDate: "2024-08-01" });
      console.log("done");
    } catch (error) {
      console.error(error);
    }
  };

  if (!vouchers) return <Loader />;

  return (
    <div className="h-full w-full flex flex-col justify-center items-center pb-44">
      <header className="flex justify-between items-center mt-2">
        <Button type="button" onClick={() => refresh()}>
          refresh
        </Button>
      </header>
      {vouchers.map((voucher) => (
        <VoucherCard
          key={voucher._id}
          voucher={voucher}
          isCollapsed={collapsed === voucher._id}
          setCollapsed={setCollapsed}
        />
      ))}
      <footer className="fixed bottom-0 h-14 w-full bg-slate-800 flex justify-center items-center">
        <p className="text-white text-lg">
          סהכ סכום שנשאר למימוש: {totalUnusedAmount} ₪
        </p>
      </footer>
    </div>
  );
}
