import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Fredoka } from "next/font/google";

import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"] });

const APP_NAME = "Mamish App";
const APP_DEFAULT_TITLE = "Mamish App";
const APP_TITLE_TEMPLATE = "%s - Mamish App";
const APP_DESCRIPTION = "Best Mamish App in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning dir="rtl">
      <body
        className={`${fredoka.className} flex select-none flex-col bg-gray-100`}
      >
        <ThemeProvider attribute="class">
          <ConvexClientProvider>
            <div className="flex h-screen flex-col">
              <Header />
              <main className="flex flex-1 flex-col items-center justify-center pt-20">
                {children}
              </main>
            </div>
          </ConvexClientProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
