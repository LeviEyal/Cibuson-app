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
  CheckboxIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { TbBarcodeOff, TbBarcode } from "react-icons/tb";
import moment from "moment";

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
        "flex flex-col items-center bg-white border-b-2 border-l-2 m-4 p-4 rounded-br-3xl rounded-tl-3xl shadow-md border-pink-500",
        isUsed ? "bg-red-50 opacity-60" : "bg-white",
      )}
    >
      <div className="w-full flex flex-row justify-between">
        <div>
          <p className="text-2xl">{voucher.amount} ₪</p>
          <p className="text-sm text-gray-500">
            {moment(voucher.date).format("DD/MM/YYYY")}
          </p>
          <p>
            {voucher.dateUsed
              ? `מומש בתאריך: ${moment(voucher.dateUsed).format("DD/MM/YYYY")}`
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
      <Button
        onClick={() => setCollapsed(isCollapsed ? null : voucher._id)}
        type="button"
        variant="cibusGhost"
        className="flex gap-2 justify-between w-40"
      >
        {!isCollapsed ? (
          <TbBarcode className="size-5" />
        ) : (
          <TbBarcodeOff className="size-5" />
        )}
        {!isCollapsed ? <p>הצג ברקוד</p> : <p>הסתר ברקוד</p>}

        <ChevronDownIcon
          className={cn(
            "size-5 ease-in-out transition-all duration-300",
            isCollapsed ? "transform rotate-180" : "transform rotate-0",
          )}
        />
      </Button>
      <div
        className={cn(
          "flex flex-col justify-center items-center gap-3 transition-all duration-300 overflow-y-hidden",
          isCollapsed ? "h-48" : "h-0",
        )}
      >
        <Image
          src={voucher.gif}
          className="h-28"
          width={500}
          height={50}
          alt="sdd"
        />
        {!isUsed ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="cibus" type="button" className="flex gap-2">
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
                <Button variant="cibusGhost" type="button">
                  ביטול
                </Button>
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
                <Button variant="cibusGhost" type="button">
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
