import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string | number | Date) => {
  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(new Date(date));
}

export const monthToHebrew = (month: string) => {
  const months = {
    "01": "ינואר",
    "02": "פברואר",
    "03": "מרץ",
    "04": "אפריל",
    "05": "מאי",
    "06": "יוני",
    "07": "יולי",
    "08": "אוגוסט",
    "09": "ספטמבר",
    "10": "אוקטובר",
    "11": "נובמבר",
    "12": "דצמבר",
  };

  // @ts-ignore
  return months[month];
};

// get yyyy-mm and return yyyy במאי
export const formatMonthInHebrew = (month: string) => {
  const [year, monthNum] = month.split("-");
  return `${monthToHebrew(monthNum)} ${year}`;
};

// return a long string in the format of x234-1y34-1a34-12cR
export const formatBarcodeNumber = (barcode: string) => {
  const parts = barcode.match(/.{1,4}/g) || [];
  return parts.join("-");
}