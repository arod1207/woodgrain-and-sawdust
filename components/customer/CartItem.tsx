"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CartItem({
  productId,
  name,
  price,
  quantity,
  image,
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  async function handleUpdateQuantity(newQty: number) {
    setIsMutating(true);
    try {
      await updateQuantity(productId, newQty);
      setMutationError(null);
    } catch {
      setMutationError("Failed to update. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRemove() {
    setIsMutating(true);
    try {
      await removeItem(productId);
    } catch {
      setMutationError("Failed to remove. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <Card className="border-cream-dark bg-white">
      <CardContent className="flex gap-4 p-4 sm:gap-6 sm:p-6">
        {/* Product Image */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-cream sm:h-32 sm:w-32">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, 128px"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-walnut">{name}</h3>
              <p className="mt-1 text-sm text-charcoal-light">
                {currencyFormatter.format(price)} each
              </p>
            </div>
            <p className="font-semibold text-walnut">
              {currencyFormatter.format(price * quantity)}
            </p>
          </div>

          {mutationError && (
            <p className="mt-1 text-sm text-red-600">{mutationError}</p>
          )}

          {/* Quantity Controls */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-cream-dark"
                onClick={() => handleUpdateQuantity(quantity - 1)}
                disabled={isMutating}
                aria-label={`Decrease quantity of ${name}`}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span
                className="w-8 text-center font-medium text-charcoal"
                aria-label={`Quantity: ${quantity}`}
              >
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-cream-dark"
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={isMutating}
                aria-label={`Increase quantity of ${name}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-charcoal-light hover:text-red-600"
              onClick={handleRemove}
              disabled={isMutating}
              aria-label={`Remove ${name} from cart`}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
