"use client";

import { AlertTriangle } from "lucide-react";

export default function OrdersError({ error }: { error: Error }) {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      Failed to load orders.{" "}
      {error.message.includes("Unauthorized") || error.message.includes("Forbidden")
        ? "Verify Convex auth is configured (CLERK_JWT_ISSUER_DOMAIN)."
        : error.message}
    </div>
  );
}
