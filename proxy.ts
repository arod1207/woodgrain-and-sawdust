import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isShopEnabled } from "@/lib/features";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);
// Order confirmation stays reachable so a payment in flight still lands somewhere
const isShopRoute = createRouteMatcher(["/shop", "/shop/((?!order-confirmation).*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isShopEnabled() && isShopRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
