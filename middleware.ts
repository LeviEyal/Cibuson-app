import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({ debug: true });

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
