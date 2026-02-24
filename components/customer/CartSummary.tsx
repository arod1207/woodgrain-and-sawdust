"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function CartSummary() {
  const { items, subtotal, itemCount, deviceId } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal);

  async function handleCheckout() {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, deviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
  }

  return (
    <Card className="border-cream-dark bg-white">
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-walnut">
          Order Summary
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-charcoal">
            <span>Subtotal ({itemCount} items)</span>
            <span className="font-medium">{formattedSubtotal}</span>
          </div>
          <div className="flex justify-between text-charcoal-light">
            <span>Shipping</span>
            <span className="text-sm italic">Calculated at checkout</span>
          </div>
        </div>

        <Separator className="my-4 bg-cream-dark" />

        <div className="flex justify-between text-lg font-semibold text-walnut">
          <span>Total</span>
          <span>{formattedSubtotal}</span>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            size="lg"
            className="w-full rounded-full bg-amber text-white hover:bg-amber-light"
            disabled={isCheckingOut || itemCount === 0}
            onClick={handleCheckout}
            aria-label="Proceed to checkout"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-full border-cream-dark text-charcoal-light hover:text-amber"
            asChild
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
