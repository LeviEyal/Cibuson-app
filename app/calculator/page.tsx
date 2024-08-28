"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

import { VoucherCardItem } from "../(cibus)/VoucherCard";
import { PageContainer } from "@/components/PageContainer";

export default function VoucherCalculatorPage() {
  const [purchaseAmount, setPurchaseAmount] = useState<number | undefined>(undefined);
  const calculateBestVouchers = useMutation(
    api.cibus.cibusQueries.calculateBestVouchers,
  );
  const [result, setResult] = useState<{
    vouchersToUse: Doc<"cibusVouchers">[];
    remainingToPayWithCard: number;
  } | null>(null);
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
    <PageContainer>
      <h1 className="text-2xl text-center mb-4">מחשבון שוברים חכם</h1>
      <form
        className="w-full max-w-sm flex flex-col gap-2 justify-center items-center"
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
              autoFocus
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

      {result && (
        <div className="w-full max-w-sm mt-6">
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg font-semibold">
              יתרת התשלום: {result.remainingToPayWithCard} ₪
            </p>
            <h2 className="text-xl font-semibold mb-4">
              השוברים שנבחרו עבור הקניה שלך
            </h2>
          </div>
          <div className="space-y-4">
            {result.vouchersToUse.map((voucher, index) => (
              <VoucherCardItem
                key={index}
                voucher={voucher}
                isCollapsed={collapsed === voucher._id}
                setCollapsed={setCollapsed}
              />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
