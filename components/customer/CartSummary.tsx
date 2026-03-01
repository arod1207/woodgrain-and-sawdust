"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CartSummary() {
  const { subtotal, itemCount } = useCart();
  const { handleCheckout, isCheckingOut, checkoutError } = useCheckout();

  const formattedSubtotal = currencyFormatter.format(subtotal);

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

        {checkoutError && (
          <p className="mt-4 text-sm text-red-600">{checkoutError}</p>
        )}

        <div className="mt-6 space-y-3">
          <Button
            size="lg"
            className="w-full bg-amber text-white"
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
            className="w-full border-cream-dark text-charcoal-light hover:text-amber"
            asChild
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
