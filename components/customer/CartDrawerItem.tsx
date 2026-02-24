"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CartDrawerItemProps {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartDrawerItem({
  productId,
  name,
  price,
  quantity,
  image,
}: CartDrawerItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const formattedLineTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price * quantity);

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-cream">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <h4 className="text-sm font-medium text-walnut leading-tight">{name}</h4>
          <p className="text-sm font-semibold text-walnut whitespace-nowrap">
            {formattedLineTotal}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-cream-dark"
              onClick={() => updateQuantity(productId, quantity - 1)}
              aria-label={`Decrease quantity of ${name}`}
            >
              <Minus className="h-2.5 w-2.5" />
            </Button>
            <span className="w-6 text-center text-xs font-medium text-charcoal">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-cream-dark"
              onClick={() => updateQuantity(productId, quantity + 1)}
              aria-label={`Increase quantity of ${name}`}
            >
              <Plus className="h-2.5 w-2.5" />
            </Button>
            <span className="ml-1 text-xs text-charcoal-light">
              {formattedPrice} ea
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-charcoal-light hover:text-red-600"
            onClick={() => removeItem(productId)}
            aria-label={`Remove ${name} from cart`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
