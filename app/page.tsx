"use client";

import { useRouter } from "next/navigation";
import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useConvexAuth,
} from "convex/react";
import { Loader } from "@/components/Loader";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <Loader />;

  if (isAuthenticated) {
    router.push("/lessons");
  } else {
    router.push("/sign-in");
  }

  // return (
  //   <>
  //     <Unauthenticated>
  //       <SignInButton />
  //     </Unauthenticated>
  //     <Authenticated>
  //       <UserButton />
  //       <Content />
  //     </Authenticated>
  //   </>
  // );
}
