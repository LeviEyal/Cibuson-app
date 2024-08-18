import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckboxIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";

interface VoucherCardProps {
  voucher: Doc<"cibusVouchers">;
  isCollapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<Id<"cibusVouchers"> | null>>;
}

export const VoucherCard = ({
  voucher,
  isCollapsed,
  setCollapsed,
}: VoucherCardProps) => {
  const markVoucherAsUsed = useMutation(
    api.cibus.cibusQueries.markVoucherAsUsed,
  );

  const unmarkVoucherAsUsed = useMutation(
    api.cibus.cibusQueries.unmarkVoucherAsUsed,
  );

  const isUsed = !!voucher.dateUsed;

  return (
    <div
      className={cn(
        "flex flex-col items-center bg-white border-b-4 m-4 p-4 rounded-lg shadow-lg",
        isUsed
          ? "bg-red-50 border-red-500/70 opacity-60"
          : "bg-white border-green-500/70",
      )}
    >
      <div className="w-full flex flex-row justify-between">
        <div>
          <p className="text-2xl">{voucher.amount} ₪</p>
          <p className="text-sm text-gray-500">
            {new Date(voucher.date).toLocaleDateString()}
          </p>
          <p>
            {voucher.dateUsed
              ? `מומש בתאריך: ${new Date(voucher.dateUsed).toLocaleDateString()}`
              : "זמין למימוש"}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <Image
            src="/ShufersalLogo.svg"
            width={70}
            height={70}
            alt="voucher"
          />
          <Link
            href={voucher.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline flex justify-center items-center gap-1"
          >
            קישור לשובר
            <ExternalLinkIcon />
          </Link>
        </div>
      </div>
      {isCollapsed ? (
        <Button
          onClick={() => setCollapsed(isCollapsed ? null : voucher._id)}
          type="button"
          variant="ghost"
          className="flex justify-between gap-2 w-32"
        >
          <p>הסתר ברקוד</p>
          <ChevronUpIcon />
        </Button>
      ) : (
        <Button
          onClick={() => setCollapsed(isCollapsed ? null : voucher._id)}
          type="button"
          variant="ghost"
          className="flex gap-2 justify-between w-32"
        >
          <p>הצג ברקוד</p>
          <ChevronDownIcon />
        </Button>
      )}
      <div
        className={cn(
          "flex flex-col justify-center items-center gap-3 transition-all duration-300 overflow-y-hidden",
          isCollapsed ? "h-48" : "h-0",
        )}
      >
        <Image
          src="/voucher.gif"
          className="h-28"
          width={500}
          height={50}
          alt="sdd"
        />
        {!isUsed ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" className="flex gap-2">
                סימון כמומש
                <CheckboxIcon className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>סימון כמומש</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                האם אתה בטוח שברצונך לסמן את השובר כמומש?
              </AlertDialogDescription>
              <AlertDialogAction asChild>
                <Button
                  type="button"
                  onClick={() => markVoucherAsUsed({ voucherId: voucher._id })}
                >
                  סימון כמומש
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel asChild>
                <Button type="button">ביטול</Button>
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button">ביטול סימון כמומש</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>ביטול סימון כמומש</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                האם אתה בטוח שברצונך לבטל את סימון השובר כמומש?
              </AlertDialogDescription>
              <AlertDialogAction asChild>
                <Button
                  type="button"
                  onClick={() =>
                    unmarkVoucherAsUsed({ voucherId: voucher._id })
                  }
                >
                  ביטול סימון כמומש
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel asChild>
                <Button className="text-black" type="button">
                  ביטול
                </Button>
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
