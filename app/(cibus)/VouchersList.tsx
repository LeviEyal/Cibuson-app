"use client";

import { useAction, usePaginatedQuery, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcwIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import InfiniteScroll from "react-infinite-scroller";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

import { EmptyState } from "@/components/EmptyState";
import { Loader } from "@/components/Loader";
import { PageContainer } from "@/components/PageContainer";
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
import type { VouchersFilters } from "@/types/vouchers-types";

import { VoucherCardItem } from "./VoucherCard";

/**
 * Represents a page component for managing vouchers.
 *
 * @returns The rendered JSX element.
 */
export const VouchersList = () => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [filter, setFilter] = useLocalStorage<VouchersFilters>(
    "vouchers-list-filter",
    "all",
  );

  const {
    results: vouchers,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.cibus.cibusQueries.allVouchers,
    { filter: filter },
    { initialNumItems: 20 },
  );

  const summary = useQuery(api.cibus.cibusQueries.allVouchersAggregated);

  const [collapsed, setCollapsed] = useState<Id<"cibusVouchers"> | null>(null);
  const updateCibusVouchers = useAction(
    api.cibus.cibusActions.updateCibusVouchers,
  );

  // Get the last date of the vouchers or 1 month ago if no vouchers exist
  const lastDate =
    vouchers?.[0]?.date || moment().subtract(1, "month").toDate();
  const lastDateFormatted = moment(lastDate).format("YYYY-MM-DD");

  const refresh = async () => {
    try {
      setIsUpdating(true);

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

  const handleChangeFilter = (filter: VouchersFilters) => {
    setFilter(filter);
  };

  if (status === "LoadingFirstPage") {
    return (
      <div className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-[2px] rounded-xl p-4">
        <Loader />
      </div>
    );
  }

  return (
    <PageContainer className="pb-16 px-4">
      <header className="mt-2 flex w-full items-center justify-between gap-3">
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

      {/* Total unused amount */}
      <section
        className="relative mt-3 p-[8px] rounded flex h-10  w-full items-center justify-center bg-pink-500"
        style={{
          backgroundImage:
            "url(data:image/gif;base64,R0lGODdhWAICAMIFAM0Mg9ojd+g3bPNKYP9cWv///////////ywAAAAAWAICAAADVwi63P4wykmrvSHrzbv/YCiOZGkKaKqubOu+cCzPdD3ceK7vfO//wKBwSCQYj8ikcslsOp/QqHR6qVqv2CzGxO16v+BSbUwum882onrNbruH07h8Tq9PEwA7)",
        }}
      >
        <p className="p-6 text-md text-pink-900 bg-white w-full h-full rounded text-center flex items-center justify-center shadow">
          <CiCircleInfo className="absolute right-3 top-2 size-6" />
          יש לך ₪ {Math.floor(summary?.totalUnusedAmount || 0)} ב-{" "}
          {summary?.totalUnusedCount} שוברים שלא נוצלו
        </p>
      </section>

      {vouchers?.length === 0 ? (
        <EmptyState
          className="mt-20"
          image="/assets/vouchers-empty-state.png"
          title="לא נמצאו שוברים להצגה"
          description="נסה לשנות את הסינון או לרענן את השוברים"
        />
      ) : (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={status === "CanLoadMore"}
          className="flex flex-1 flex-col gap-4 mt-4"
          loader={
            <div className="w-full flex justify-center" key={0}>
              <Loader />
            </div>
          }
        >
          <AnimatePresence initial={false}>
            {vouchers.map((voucher) => (
              <motion.div
                key={voucher._id}
                initial={{ height: 0, scale: 0 }}
                animate={{ height: "auto", scale: 1 }}
                exit={{ height: 0, scale: 0 }}
                style={{ overflow: "hidden" }}
              >
                <VoucherCardItem
                  key={voucher._id}
                  voucher={voucher}
                  isCollapsed={collapsed === voucher._id}
                  setCollapsed={setCollapsed}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </InfiniteScroll>
      )}
    </PageContainer>
  );
};
