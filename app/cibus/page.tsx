"use client";

import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { VoucherCard } from "./VoucherCard";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { RefreshCcwIcon } from "lucide-react";

export default function Page() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const vouchers = useQuery(api.cibus.cibusQueries.allVouchers, {});
  const [collapsed, setCollapsed] = useState<Id<"cibusVouchers"> | null>(null);
  const updateCibusVouchers = useAction(
    api.cibus.cibusActions.updateCibusVouchers,
  );

  const lastDate = vouchers?.[0]?.date || 0;
  const lastDateFormatted = formatDate(lastDate);

  const totalUnusedAmount = vouchers
    ?.filter((v) => !v.dateUsed)
    .reduce((acc, v) => acc + v.amount, 0);

  const refresh = async () => {
    try {
      setIsUpdating(true);
      await updateCibusVouchers({ fromDate: lastDateFormatted });
    } catch (error) {
      console.error(error);
      toast.error("אירעה שגיאה בעדכון הקופונים");
    } finally {
      setIsUpdating(false);
      toast.success("הקופונים עודכנו בהצלחה");
    }
  };

  if (!vouchers) return <Loader />;

  return (
    <div className="h-full w-full flex flex-col justify-center items-center pb-20">
      <header className="flex justify-between items-center mt-4">
        <Button
          disabled={isUpdating}
          type="button"
          className="flex gap-5 bg-gradient-to-r from-pink-800 to-orange-700 rounded-3xl"
          onClick={() => refresh()}
        >
          {isUpdating ? "מעדכן..." : "רענן קופונים"}
          <RefreshCcwIcon className="size-5" />
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
      <footer className="fixed bottom-0 h-14 w-full bg-gradient-to-r from-pink-950 to-orange-700 flex justify-center items-center">
        <p className="text-white text-xl">
          סה&quot;כ סכום זמין למימוש: {totalUnusedAmount} ₪
        </p>
      </footer>
    </div>
  );
}
