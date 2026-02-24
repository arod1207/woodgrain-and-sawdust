"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const order = useQuery(
    api.orders.getOrderBySessionId,
    sessionId ? { stripeSessionId: sessionId } : "skip"
  );

  // Belt-and-suspenders: clear local cart on confirmation
  useEffect(() => {
    if (order?.status === "paid") {
      clearCart();
    }
  }, [order?.status, clearCart]);

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-walnut">
          No order found
        </h1>
        <p className="mb-6 text-charcoal-light">
          It looks like you arrived here without completing a checkout.
        </p>
        <Button
          size="lg"
          className="rounded-full bg-amber text-white hover:bg-amber-light"
          asChild
        >
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-walnut">
          Order not found
        </h1>
        <p className="mb-6 text-charcoal-light">
          We couldn&apos;t find this order. It may still be processing.
        </p>
        <Button
          size="lg"
          className="rounded-full bg-amber text-white hover:bg-amber-light"
          asChild
        >
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-sage" />
        <h1 className="mb-2 text-3xl font-bold text-walnut">Thank you!</h1>
        <p className="text-charcoal-light">
          Your order has been {order.status === "paid" ? "confirmed" : "received"}.
        </p>
      </div>

      <Card className="mb-6 border-cream-dark bg-white">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-walnut">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-charcoal-light" />
                  <div>
                    <p className="font-medium text-charcoal">{item.name}</p>
                    <p className="text-sm text-charcoal-light">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-charcoal">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4 bg-cream-dark" />

          <div className="space-y-2">
            <div className="flex justify-between text-charcoal">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal">
              <span>Shipping</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>
            <Separator className="my-2 bg-cream-dark" />
            <div className="flex justify-between text-lg font-semibold text-walnut">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.shippingAddress && (
        <Card className="mb-6 border-cream-dark bg-white">
          <CardContent className="p-6">
            <h2 className="mb-3 text-lg font-semibold text-walnut">
              Shipping Address
            </h2>
            <div className="text-charcoal">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && (
                <p>{order.shippingAddress.line2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button
          size="lg"
          className="rounded-full bg-amber text-white hover:bg-amber-light"
          asChild
        >
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
