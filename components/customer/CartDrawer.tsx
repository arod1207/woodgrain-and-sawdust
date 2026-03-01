"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, ShoppingCart, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import CartDrawerItem from "@/components/customer/CartDrawerItem";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CartDrawer() {
  const { items, subtotal, itemCount, isLoading } = useCart();
  const { handleCheckout, isCheckingOut, checkoutError } = useCheckout();
  const [open, setOpen] = useState(false);

  const formattedSubtotal = currencyFormatter.format(subtotal);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative text-charcoal-light transition-colors hover:text-amber"
          aria-label={`Shopping cart with ${itemCount} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber text-xs font-bold text-white">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-walnut">
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 flex-col gap-4 px-4 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <ShoppingBag className="h-16 w-16 text-cream-dark" />
            <div>
              <p className="text-lg font-medium text-walnut">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-charcoal-light">
                Browse our collection and find something you love.
              </p>
            </div>
            <Button
              className="bg-amber text-white"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <div className="divide-y divide-cream-dark">
                {items.map((item) => (
                  <CartDrawerItem
                    key={item.productId}
                    productId={item.productId}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-cream-dark px-4 pt-4 pb-4">
              <div className="flex justify-between text-sm text-charcoal">
                <span>Subtotal</span>
                <span className="font-semibold text-walnut">
                  {formattedSubtotal}
                </span>
              </div>
              <p className="mt-1 text-xs text-charcoal-light">
                Shipping calculated at checkout
              </p>

              <Separator className="my-3 bg-cream-dark" />

              {checkoutError && (
                <p className="mb-2 text-sm text-red-600">{checkoutError}</p>
              )}

              <div className="space-y-2">
                <Button
                  size="lg"
                  className="w-full bg-amber text-white"
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
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
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-full items-center justify-center rounded-md border-2 border-cream-dark text-sm font-medium text-charcoal transition-colors hover:border-amber hover:text-amber"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
