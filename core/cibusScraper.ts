import type { Voucher, VouchersScrapper } from "./VouchersScrapper.interface";

export class CibusScraper implements VouchersScrapper {
  private rawText: string;

  constructor(rawText: string) {
    this.rawText = rawText;
  }

  extractBarcodeNumber(text: string): string | null {
    const regex = /\d{18,21}/g;
    const match = text.match(regex);
    return match ? match[0] : null;
  }

  extractPluxeeUrls(text: string): string | null {
    const regex = /https:\/\/myconsumers\.pluxee\.co\.il\/b\?[^ \]\n]+/g;
    const matche = text.match(regex);
    return matche ? matche[0] : null;
  }

  extractEmployerContribution(text: string): string | null {
    const regex = /השתתפות מקום העבודה: ₪([\d,.]+)/;
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  validateFromDate(fromDate: string): void {
    if (!fromDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error("Invalid date format");
    }
  }

  extractVoucherInfo() {
    return {
      date: 0,
      amount: 0,
      url: "",
      gif: "",
    } as Voucher;
  }
}
