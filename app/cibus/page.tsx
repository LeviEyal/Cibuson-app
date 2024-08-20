"use client";

import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { VoucherCard } from "./VoucherCard";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RefreshCcwIcon } from "lucide-react";
import moment from "moment";
import { useLocalStorage } from "usehooks-ts";

export default function Page() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [filter, setFilter] = useLocalStorage<"all" | "unused" | "used">(
    "vouchers-list-filter",
    "all",
  );
  const vouchers = useQuery(api.cibus.cibusQueries.allVouchers, {
    filter: filter,
  });
  const [collapsed, setCollapsed] = useState<Id<"cibusVouchers"> | null>(null);
  const updateCibusVouchers = useAction(
    api.cibus.cibusActions.updateCibusVouchers,
  );

  const lastDate =
    vouchers?.[0]?.date || moment().subtract(1, "month").toDate();
  const lastDateFormatted = moment(lastDate).format("YYYY-MM-DD");

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

  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setFilter(e.target.value as "all" | "unused" | "used");
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between pb-20">
      <header className="mt-4 flex w-full items-center justify-between gap-3 px-5">
        <Button
          disabled={isUpdating || !vouchers}
          type="button"
          className="flex w-full gap-5 rounded-3xl bg-gradient-to-b from-pink-800 to-pink-600"
          onClick={() => refresh()}
        >
          {isUpdating ? "מעדכן..." : "רענן קופונים"}
          <RefreshCcwIcon
            className={cn("size-5", isUpdating && "animate-spin")}
          />
        </Button>

        <select
          name="type"
          id="type"
          value={filter}
          className="h-full w-full rounded-3xl border-2 border-pink-500 bg-white px-2"
          onChange={handleChangeFilter}
        >
          <option value="all">כל הקופונים</option>
          <option value="unused">קופונים שלא מומשו</option>
          <option value="used">קופונים שמומשו</option>
        </select>
      </header>

      {vouchers?.length === 0 && (
        <p className="flex h-full flex-col justify-center text-3xl">
          אין קופונים להצגה
        </p>
      )}

      {/* Vouchers cards */}
      <main className="flex flex-1 flex-col">
        {vouchers ? (
          vouchers.map((voucher) => (
            <VoucherCard
              key={voucher._id}
              voucher={voucher}
              isCollapsed={collapsed === voucher._id}
              setCollapsed={setCollapsed}
            />
          ))
        ) : (
          <Loader />
        )}
      </main>

      {/* Total unused amount */}
      {/* <footer className="fixed bottom-0 h-14 w-full bg-gradient-to-b from-pink-800 to-pink-600 flex justify-center items-center"> */}
      <footer
        className="fixed bottom-0 flex h-14 w-full items-center justify-center"
        style={{
          backgroundImage:
            "url(data:image/gif;base64,R0lGODdhWAICAMIFAM0Mg9ojd+g3bPNKYP9cWv///////////ywAAAAAWAICAAADVwi63P4wykmrvSHrzbv/YCiOZGkKaKqubOu+cCzPdD3ceK7vfO//wKBwSCQYj8ikcslsOp/QqHR6qVqv2CzGxO16v+BSbUwum882onrNbruH07h8Tq9PEwA7)",
        }}
      >
        <p className="text-xl text-white">
          סה&quot;כ סכום זמין למימוש: {Math.floor(totalUnusedAmount || 0)} ₪
        </p>
      </footer>
    </div>
  );
}
