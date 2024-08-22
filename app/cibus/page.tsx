"use client";

import { useOrganization } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";
import { LucideMessageSquareWarning, RefreshCcwIcon } from "lucide-react";
import moment from "moment";
import { use, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { VoucherCardItem } from "./VoucherCard";

export default function Page() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [filter, setFilter] = useLocalStorage<
    "all" | "unused" | "used" | "bugged"
  >("vouchers-list-filter", "all");

  const { organization } = useOrganization();
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
      console.log({ organization });

      await updateCibusVouchers({
        fromDate: lastDateFormatted,
      });
      toast.success("השוברים עודכנו בהצלחה");
    } catch (error) {
      console.error(error);
      toast.error("אירעה שגיאה בעדכון השוברים", {
        action: {
          label: "נסה שוב",
          onClick: refresh,
        },
        description: "אם הבעיה חוזרת נא לנסות להתחבר מחדש",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeFilter = (filter: "all" | "unused" | "used" | "bugged") => {
    setFilter(filter);
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
          {isUpdating ? "סורק..." : "משוך שוברים"}
          <RefreshCcwIcon
            className={cn("size-5", isUpdating && "animate-spin")}
          />
        </Button>

        <Select value={filter} onValueChange={handleChangeFilter}>
          <SelectTrigger
            className="border-pink-700 rounded-3xl text-pink-700 focus:ring-0"
            dir="rtl"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectGroup>
              <SelectItem value="all">כל השוברים</SelectItem>
              <SelectItem value="unused">שוברים שלא נוצלו</SelectItem>
              <SelectItem value="used">שוברים שנוצלו</SelectItem>
              <SelectItem value="bugged">שוברים תקולים</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </header>

      {vouchers?.length === 0 && (
        <p className="flex h-full flex-col justify-center text-3xl">
          אין שוברים להצגה
        </p>
      )}

      {/* Vouchers cards */}
      <main className="flex flex-1 flex-col mx-4 gap-4 mt-4">
        {vouchers ? (
          vouchers.map((voucher) => (
            <VoucherCardItem
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
