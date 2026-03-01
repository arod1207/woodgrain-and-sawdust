"use client";

import Link from "next/link";
import { usePaginatedQuery, useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2, AlertTriangle } from "lucide-react";
import OrderStatusSelect from "./OrderStatusSelect";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type StatusFilter = "all" | "pending" | "paid" | "failed";
const VALID_FILTERS: StatusFilter[] = ["all", "pending", "paid", "failed"];

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
};

const PAGE_SIZE = 25;

export default function AdminOrdersClient({
  activeFilter,
}: {
  activeFilter: StatusFilter;
}) {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();

  const status = activeFilter === "all" ? undefined : activeFilter;

  const { results: orders, status: pageStatus, loadMore } = usePaginatedQuery(
    api.orders.getAllOrders,
    authLoading || !isAuthenticated ? "skip" : { status },
    { initialNumItems: PAGE_SIZE },
  );

  const counts = useQuery(
    api.orders.getOrderCounts,
    authLoading || !isAuthenticated ? "skip" : undefined,
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-charcoal-light">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading orders…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Not authenticated. Verify Convex auth is configured (CLERK_JWT_ISSUER_DOMAIN).
      </div>
    );
  }

  if (pageStatus === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center py-24 text-charcoal-light">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading orders…
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-walnut sm:text-3xl">Orders</h1>
        <p className="mt-2 text-charcoal-light">
          {counts !== undefined
            ? `${counts.all} total ${counts.all === 1 ? "order" : "orders"}`
            : "Loading…"}
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {VALID_FILTERS.map((filter) => (
          <Link
            key={filter}
            href={filter === "all" ? "/admin/orders" : `/admin/orders?status=${filter}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "border-amber bg-amber text-white"
                : "border-cream-dark bg-white text-charcoal-light hover:border-amber hover:text-amber"
            }`}
          >
            {FILTER_LABELS[filter]}{" "}
            <span
              className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
                activeFilter === filter ? "bg-white/20" : "bg-cream-dark"
              }`}
            >
              {counts !== undefined ? counts[filter] : "–"}
            </span>
          </Link>
        ))}
      </div>

      {/* Orders List */}
      <Card className="border-cream-dark">
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-medium text-charcoal">No orders found</h3>
              <CardDescription>
                {activeFilter === "all"
                  ? "Orders will appear here once customers complete checkout."
                  : `No ${activeFilter} orders at the moment.`}
              </CardDescription>
            </div>
          ) : (
            <div className="divide-y divide-cream-dark">
              {orders.map((order) => (
                <div key={order._id} className="p-4 sm:p-6">
                  {/* Top row — customer identity + status + total */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      {order.shippingAddress?.name && (
                        <p className="font-semibold text-charcoal">
                          {order.shippingAddress.name}
                        </p>
                      )}
                      <p className="text-sm text-charcoal">
                        {order.customerEmail ?? "Guest"}
                      </p>
                      <p className="text-xs text-charcoal-light">
                        {new Date(order.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {" · "}
                        <span className="font-mono text-[11px]">
                          {order._id.slice(-8)}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <OrderStatusSelect
                        key={order.status}
                        orderId={order._id}
                        currentStatus={order.status}
                      />
                      <p className="font-semibold text-walnut">
                        {currencyFormatter.format(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-cream-dark px-3 py-0.5 text-xs text-charcoal"
                      >
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>

                  {/* Shipping address */}
                  {order.shippingAddress && (
                    <div className="mt-2 text-xs text-charcoal-light">
                      <p>
                        {order.shippingAddress.line1}
                        {order.shippingAddress.line2
                          ? `, ${order.shippingAddress.line2}`
                          : ""}
                      </p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode},{" "}
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Load More */}
      {pageStatus === "CanLoadMore" && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMore(PAGE_SIZE)}
            className="border-cream-dark text-charcoal-light hover:border-amber hover:text-amber"
          >
            Load more orders
          </Button>
        </div>
      )}
      {pageStatus === "LoadingMore" && (
        <div className="mt-6 flex justify-center text-charcoal-light">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading more…
        </div>
      )}
    </div>
  );
}
