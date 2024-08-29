import {
  CheckboxIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import { LucideSquareCheckBig } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { AiOutlineRotateRight } from "react-icons/ai";
import { CiShare2 } from "react-icons/ci";
import { TbBarcode, TbBarcodeOff, TbBug } from "react-icons/tb";
import { useLocalStorage } from "usehooks-ts";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { cn, formatBarcodeNumber } from "@/lib/utils";

interface VoucherCardProps {
  voucher: Doc<"cibusVouchers">;
  isCollapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<Id<"cibusVouchers"> | null>>;
}

export const VoucherCardItem = ({
  voucher,
  isCollapsed,
  setCollapsed,
}: VoucherCardProps) => {
  const [vertically, setVertically] = useLocalStorage<boolean>(
    "vertically-voucher-display",
    false,
  );
  const markVoucherAsUsed = useMutation(
    api.cibus.cibusQueries.markVoucherAsUsed,
  );

  const unmarkVoucherAsUsed = useMutation(
    api.cibus.cibusQueries.unmarkVoucherAsUsed,
  );

  const markBuggedVoucher = useMutation(
    api.cibus.cibusQueries.markBuggedVoucher,
  );

  const unmarkBuggedVoucher = useMutation(
    api.cibus.cibusQueries.unmarkBuggedVoucher,
  );

  const handleMarkVoucherAsUsed = async () => {
    await markVoucherAsUsed({ voucherId: voucher._id });
    setCollapsed(null);
  };

  const handleUnmarkVoucherAsUsed = async () => {
    await unmarkVoucherAsUsed({ voucherId: voucher._id });
    setCollapsed(null);
  };

  const handleMarkBuggedVoucher = async () => {
    await markBuggedVoucher({ voucherId: voucher._id });
    setCollapsed(null);
  };

  const isUsed = !!voucher.dateUsed;

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-br-3xl rounded-tl-3xl border-b-2 border-l-2  bg-white p-4 shadow-md",
        isUsed ? "bg-red-50 opacity-60" : "bg-white",
        voucher.provider === "cibus" ? "border-pink-500" : "border-orange-500",
      )}
    >
      <div className="flex w-full flex-row justify-between">
        <div>
          <p className="text-2xl">₪ {voucher.amount}</p>
          <p className="text-sm text-gray-500">
            {moment(voucher.date).format("DD/MM/YYYY")}
          </p>
          <p>
            {voucher.dateUsed ? (
              `מומש בתאריך: ${moment(voucher.dateUsed).format("DD/MM/YYYY")}`
            ) : voucher.isBugged ? (
              <p className="flex gap-2 items-center">
                תקול
                <TbBug className="size-5 text-yellow-700" />
              </p>
            ) : (
              "זמין למימוש"
            )}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <Image
            src={
              voucher.provider === "cibus" ? "/cibus-logo.png" : "/10bis.png"
            }
            width={50}
            height={50}
            alt="provider"
          />
          <Image
            src="/ShufersalLogo.svg"
            width={70}
            height={70}
            alt="voucher"
          />
        </div>
      </div>
      <Button
        onClick={() => setCollapsed(isCollapsed ? null : voucher._id)}
        type="button"
        variant="cibusGhost"
        className="flex w-40 justify-between gap-2"
      >
        {!isCollapsed ? (
          <TbBarcode className="size-5" />
        ) : (
          <TbBarcodeOff className="size-5" />
        )}
        {!isCollapsed ? <p>הצג ברקוד</p> : <p>הסתר ברקוד</p>}

        <ChevronDownIcon
          className={cn(
            "size-5 transition-all duration-300 ease-in-out",
            isCollapsed ? "rotate-180 transform" : "rotate-0 transform",
          )}
        />
      </Button>
      <div
        className={cn(
          "flex flex-col items-center justify-between gap-3 overflow-y-hidden transition-all duration-150 overflow-x-clip",
          isCollapsed ? (vertically ? "h-[400px]" : "h-56") : "h-0",
        )}
      >
        {/* Barcode Image */}
        <Image
          src={voucher.gif}
          className={cn(
            "h-28 w-full transition-all duration-300 ease-in-out",
            vertically && "rotate-90 w-[700px] h-64 object-fill",
          )}
          width={200}
          height={200}
          alt="Barcode image"
        />

        <div className="flex gap-2 mt-2 items-center z-20">

          {/* Barcode Number */}
          <p className="text text-gray-500">{formatBarcodeNumber(voucher.barcodeNumber || "")}</p>

          {/* Rotate Barcode Image Button */}
          <AiOutlineRotateRight
            className="size-6"
            onClick={() => setVertically((prev) => !prev)}
          />
        </div>

        {/* Sharing */}
        <section className="flex gap-2">
          <Link
            href={voucher.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 text-blue-500 underline"
          >
            קישור לשובר
            <ExternalLinkIcon />
          </Link>

          {/* send via whatsapp button */}
          <Button
            type="button"
            className="text-black gap-2"
            variant="outline"
            onClick={() => {
              navigator
                .share({
                  title: "web.dev",
                  text: "Check out web.dev.",
                  url: "https://web.dev/",
                })
                .then(() => console.log("Successful share"))
                .catch((error) => console.log("Error sharing", error));
            }}
          >
            {/* שלח בוואטסאפ */}
            <CiShare2 className="size-5" />
          </Button>

          {/* <ShareButton /> */}
        </section>

        {/* Actions */}
        <section className="flex gap-2">
          {!isUsed ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="cibus"
                  type="button"
                  className="flex gap-2 w-40"
                >
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
                  <Button type="button" onClick={handleMarkVoucherAsUsed}>
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
                <Button type="button">
                  מומש
                  <LucideSquareCheckBig className="size-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ביטול סימון כמומש</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  האם אתה בטוח שברצונך לבטל את סימון השובר כמומש?
                </AlertDialogDescription>
                <AlertDialogAction asChild>
                  <Button type="button" onClick={handleUnmarkVoucherAsUsed}>
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

          {/* Mark as broken */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="warning"
                type="button"
                className="flex gap-2 w-40"
              >
                תקלה
                <TbBug className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>סימון כמומש</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                האם אתה בטוח שברצונך לסמן את השובר כתקול?
              </AlertDialogDescription>
              <AlertDialogAction asChild>
                <Button
                  variant="warning"
                  type="button"
                  onClick={handleMarkBuggedVoucher}
                >
                  סימון כתקול
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel asChild>
                <Button variant="cibusGhost" type="button">
                  ביטול
                </Button>
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
};

VoucherCardItem.Skeleton = function VoucherCardSkeleton() {
  return (
    <div className="w-11/12 flex flex-col items-center rounded-br-3xl rounded-tl-3xl border-b-2 border-l-2 bg-white p-4 shadow-md mt-4">
      <div className="flex w-full flex-row justify-between">
        <div>
          <Skeleton className="w-20 h-6 mb-2" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-32 h-10" />
        </div>
      </div>
      <div className="flex w-40 justify-between gap-2">
        <Skeleton className="w-32 h-10" />
      </div>
    </div>
  );
};
