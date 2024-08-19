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
    <div className="h-full w-full flex flex-col justify-between items-center pb-20">
      <header className="w-full flex justify-between items-center mt-4 gap-3 px-5">
        <Button
          disabled={isUpdating || !vouchers}
          type="button"
          className="w-full flex gap-5 bg-gradient-to-b from-pink-800 to-pink-600 rounded-3xl"
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
          className="h-full w-full px-2 bg-white border-2 border-pink-500 rounded-3xl"
          onChange={handleChangeFilter}
        >
          <option value="all">כל הקופונים</option>
          <option value="unused">קופונים שלא מומשו</option>
          <option value="used">קופונים שמומשו</option>
        </select>
      </header>

      {vouchers?.length === 0 && (
        <p className="h-full flex flex-col justify-center text-3xl">
          אין קופונים להצגה
        </p>
      )}

      {/* Vouchers cards */}
      <main className="flex-1 flex flex-col">
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
        className="fixed bottom-0 h-14 w-full flex justify-center items-center"
        style={{
          backgroundImage:
            "url(data:image/gif;base64,R0lGODdhWAICAMIFAM0Mg9ojd+g3bPNKYP9cWv///////////ywAAAAAWAICAAADVwi63P4wykmrvSHrzbv/YCiOZGkKaKqubOu+cCzPdD3ceK7vfO//wKBwSCQYj8ikcslsOp/QqHR6qVqv2CzGxO16v+BSbUwum882onrNbruH07h8Tq9PEwA7)",
        }}
      >
        <p className="text-white text-xl">
          סה&quot;כ סכום זמין למימוש: {Math.floor(totalUnusedAmount || 0)} ₪
        </p>
      </footer>
    </div>
  );
}
