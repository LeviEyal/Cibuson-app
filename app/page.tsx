"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { Loader } from "@/components/Loader";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <Loader />;

  if (isAuthenticated) {
    router.push("/cibus");
  } else {
    router.push("/sign-in");
  }
}
