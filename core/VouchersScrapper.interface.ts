import type { Doc } from "@/convex/_generated/dataModel";

export type Voucher = Doc<"cibusVouchers">;

export interface VouchersScrapper {
  extractBarcodeNumber(text: string): string | null;
  extractPluxeeUrls(text: string): string | null;
  extractEmployerContribution(text: string): string | null;
  validateFromDate(fromDate: string): void;
  extractVoucherInfo(): Voucher;
}
