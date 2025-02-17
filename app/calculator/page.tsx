"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

import { VoucherCardItem } from "../(cibus)/VoucherCard";
import { formatPrice } from "@/lib/utils";

export default function VoucherCalculatorPage() {
  const [purchaseAmount, setPurchaseAmount] = useState<number | undefined>(
    undefined,
  );
  const calculateBestVouchers = useMutation(
    api.cibus.cibusQueries.calculateBestVouchers,
  );

  const [result, setResult] = useState<{
    vouchersToUse: Id<"cibusVouchers">[];
    remainingToPayWithCard: number;
  } | null>(null);

  const vouchers = useQuery(api.cibus.cibusQueries.vouchersByIds, {
    ids: result?.vouchersToUse ?? [],
  });

  const [collapsed, setCollapsed] = useState<Id<"cibusVouchers"> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseAmount) return;

    const calculatedResult = await calculateBestVouchers({
      purchaseSum: purchaseAmount,
    });
    setResult(calculatedResult);
  };

  return (
    <PageContainer className="pb-10 pt-2">
      <h1 className="text-2xl text-center mb-4 font-bold">מחשבון שוברים חכם</h1>
      <form
        className="w-full max-w- flex flex-col gap-2 justify-center items-center "
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="purchaseAmount"
          className="text-gray-700 text-sm font-bold mb-2"
        >
          הזן את סכום הקניה
        </label>
        <div className="mb-4 flex gap-2">
          <div className="relative">
            <Input
              type="number"
              id="purchaseAmount"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(parseFloat(e.target.value))}
              required
              className="rounded-2xl w-24 text-pink-700 border-pink-700"
              min={0}
              max={10000}
            />
            <p className="absolute left-3 top-2 text-pink-700 text-sm font-bold">
              ₪
            </p>
          </div>
          <Button type="submit" className="w-full">
            מצא את השוברים הכי טובים
          </Button>
        </div>
      </form>

      {result ? (
        <div className="w-full max-w-sm mt-6">
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg font-semibold">
              יתרת התשלום: {formatPrice(result.remainingToPayWithCard)}
            </p>
            <h2 className="text-xl font-semibold mb-4">
              השוברים שנבחרו עבור הקניה שלך
            </h2>
          </div>
          <div className="space-y-4">
            {vouchers &&
              vouchers?.map((voucher, index) => (
                <VoucherCardItem
                  key={index}
                  voucher={voucher}
                  isCollapsed={collapsed === voucher._id}
                  setCollapsed={setCollapsed}
                />
              ))}
          </div>
        </div>
      ) : (
        <EmptyState
          className="mt-16"
          image="/assets/calculator-empty-state.png"
          title="נמצאים ליד הקופה?"
          description="יש להזין סכום קניה והשוברים הכי מתאימים יופיעו כאן"
        />
      )}
    </PageContainer>
  );
}
