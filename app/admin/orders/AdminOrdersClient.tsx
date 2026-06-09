"use client";

import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2, AlertTriangle, ShoppingBag, Truck } from "lucide-react";

const shippingStatusStyles: Record<string, string> = {
  not_shipped: "bg-cream-dark text-charcoal-light",
  shipped: "bg-amber/15 text-amber",
  delivered: "bg-sage/15 text-sage",
};

const shippingStatusLabel: Record<string, string> = {
  not_shipped: "Not Shipped",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function AdminOrdersClient() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const [shipFormOpen, setShipFormOpen] = useState<Id<"orders"> | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const orders = useQuery(
    api.orders.getAllOrdersAdmin,
    authLoading || !isAuthenticated ? "skip" : {},
  );
  const updateShipping = useMutation(api.orders.updateShipping);

  async function handleMarkShipped(orderId: Id<"orders">) {
    const order = orders?.find((o) => o._id === orderId);
    try {
      setActionError(null);
      const tracking = trackingInput.trim() || undefined;
      await updateShipping({ orderId, shippingStatus: "shipped", trackingNumber: tracking });
      setShipFormOpen(null);
      setTrackingInput("");

      if (order?.customerEmail && order.customerName) {
        fetch("/api/ship-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toEmail: order.customerEmail,
            toName: order.customerName,
            crossName: order.crossName,
            trackingNumber: tracking,
          }),
        }).catch((err) => console.error("Shipping email failed:", err));
      }
    } catch {
      setActionError("Failed to update shipping status. Please try again.");
    }
  }

  async function handleMarkDelivered(orderId: Id<"orders">) {
    try {
      setActionError(null);
      await updateShipping({ orderId, shippingStatus: "delivered" });
    } catch {
      setActionError("Failed to update shipping status. Please try again.");
    }
  }

  if (authLoading || orders === undefined) {
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
        Not authenticated. Verify Convex auth is configured.
      </div>
    );
  }

  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((sum, o) => sum + o.amountTotal, 0) / 100;
  const shipped = paid.filter((o) => (o.shippingStatus ?? "not_shipped") !== "not_shipped").length;

  return (
    <div>
      {actionError && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-walnut-dark/20 bg-walnut-dark/10 px-4 py-3 text-sm text-walnut-dark">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-walnut sm:text-3xl">Orders</h1>
          <p className="mt-2 text-charcoal-light">
            Cross purchases via Stripe Checkout.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="rounded-lg border border-cream-dark bg-white px-4 py-3">
            <p className="text-charcoal-light">Paid orders</p>
            <p className="text-2xl font-bold text-walnut">{paid.length}</p>
          </div>
          <div className="rounded-lg border border-cream-dark bg-white px-4 py-3">
            <p className="text-charcoal-light">Shipped</p>
            <p className="text-2xl font-bold text-sage">{shipped}</p>
          </div>
          <div className="rounded-lg border border-cream-dark bg-white px-4 py-3">
            <p className="text-charcoal-light">Revenue</p>
            <p className="text-2xl font-bold text-amber">
              ${revenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <Card className="border-cream-dark">
        <CardContent className="p-0">
          {paid.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-medium text-charcoal">No paid orders yet</h3>
              <CardDescription>
                Orders will appear here once someone buys a cross.
              </CardDescription>
            </div>
          ) : (
            <div className="divide-y divide-cream-dark">
              {paid.map((order) => {
                const shippingStatus = order.shippingStatus ?? "not_shipped";
                const isFormOpen = shipFormOpen === order._id;
                const isLocalPickup = order.shippingMethod === "local_pickup";

                return (
                  <div key={order._id} className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-charcoal">
                            {order.crossName}
                          </p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${shippingStatusStyles[shippingStatus]}`}
                          >
                            {isLocalPickup && shippingStatus === "not_shipped"
                              ? "Awaiting Pickup"
                              : shippingStatusLabel[shippingStatus]}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal-light">
                          {order.customerEmail}
                          {order.customerName ? ` · ${order.customerName}` : ""}
                        </p>
                        <p className="text-xs text-charcoal-light">
                          {isLocalPickup
                            ? "Local pickup"
                            : order.shippingAddress
                              ? `Ship to ${order.shippingAddress.city}, ${order.shippingAddress.state}`
                              : "Standard shipping"}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-xs text-charcoal-light">
                            Tracking:{" "}
                            <span className="font-medium text-charcoal">
                              {order.trackingNumber}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <p className="font-semibold text-walnut">
                          ${(order.amountTotal / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-charcoal-light">
                          {new Date(order.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>

                        {shippingStatus === "not_shipped" && (
                          <button
                            onClick={() => {
                              setShipFormOpen(isFormOpen ? null : order._id);
                              setTrackingInput("");
                            }}
                            className="flex items-center gap-1.5 rounded-full bg-amber px-3 py-1.5 text-xs font-medium text-white hover:bg-amber/90"
                          >
                            <Truck className="h-3 w-3" />
                            {isLocalPickup ? "Mark Picked Up" : "Mark Shipped"}
                          </button>
                        )}

                        {shippingStatus === "shipped" && (
                          <button
                            onClick={() => handleMarkDelivered(order._id)}
                            className="rounded-full bg-sage/20 px-3 py-1.5 text-xs font-medium text-sage hover:bg-sage/30"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>

                    {isFormOpen && !isLocalPickup && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-cream-dark pt-3">
                        <input
                          type="text"
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder="Tracking number (optional)"
                          className="min-w-48 flex-1 rounded-lg border border-cream-dark bg-white px-3 py-1.5 text-sm text-charcoal placeholder:text-charcoal-light focus:border-amber focus:outline-none"
                        />
                        <button
                          onClick={() => handleMarkShipped(order._id)}
                          className="rounded-full bg-amber px-4 py-1.5 text-xs font-medium text-white hover:bg-amber/90"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setShipFormOpen(null);
                            setTrackingInput("");
                          }}
                          className="rounded-full border border-cream-dark px-4 py-1.5 text-xs font-medium text-charcoal-light hover:border-charcoal-light"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {isFormOpen && isLocalPickup && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-cream-dark pt-3">
                        <p className="flex-1 text-sm text-charcoal-light">
                          Confirm this order has been picked up?
                        </p>
                        <button
                          onClick={() => handleMarkDelivered(order._id)}
                          className="rounded-full bg-amber px-4 py-1.5 text-xs font-medium text-white hover:bg-amber/90"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setShipFormOpen(null)}
                          className="rounded-full border border-cream-dark px-4 py-1.5 text-xs font-medium text-charcoal-light hover:border-charcoal-light"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
