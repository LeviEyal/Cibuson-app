import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ReactNode } from "react";

export default function ProductLayout({ children }: { children: ReactNode }) {
    return (
      <ConvexClientProvider>
        <div className="flex min-h-screen w-full">
          {children}
        </div>
      </ConvexClientProvider>
    );
  }