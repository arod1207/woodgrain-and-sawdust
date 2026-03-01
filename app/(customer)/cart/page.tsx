"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/customer/CartItem";
import CartSummary from "@/components/customer/CartSummary";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { items, isLoading } = useCart();

  // Cart loading from localStorage
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-walnut">Your Cart</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-36 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-charcoal-light/40" />
        <h1 className="mb-2 text-2xl font-bold text-walnut">
          Your cart is empty
        </h1>
        <p className="mb-6 text-charcoal-light">
          Looks like you haven&apos;t added any items yet.
        </p>
        <Button
          size="lg"
          className="bg-amber text-white"
          asChild
        >
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-walnut">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.productId}
              productId={item.productId}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              image={item.image}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
