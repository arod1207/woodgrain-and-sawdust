"use client";

import { AlertTriangle } from "lucide-react";

export default function OrdersError({ error }: { error: Error }) {
  const isAuthError =
    error.message.includes("Unauthorized") || error.message.includes("Forbidden");

  if (!isAuthError) {
    console.error("[OrdersError]", error);
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      Failed to load orders.{" "}
      {isAuthError
        ? "Verify Convex auth is configured (CLERK_JWT_ISSUER_DOMAIN)."
        : "An unexpected error occurred. Please try again or contact support."}
    </div>
  );
}
