"use client";

import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useQuery, useConvexAuth } from "convex/react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <div>טוען...</div>;
  }

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
