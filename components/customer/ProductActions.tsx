"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Check, Loader2, Minus, Plus } from "lucide-react";

const MAX_QTY = 99;

interface ProductActionsProps {
  productId: string;
  productName: string;
  price: number;
  inStock: boolean;
  imageUrl: string;
  formattedPrice: string;
  children: ReactNode;
}

export default function ProductActions({
  productId,
  productName,
  price,
  inStock,
  imageUrl,
  formattedPrice,
  children,
}: ProductActionsProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [addFailed, setAddFailed] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(
        { productId, name: productName, price, image: imageUrl },
        quantity
      );
      setJustAdded(true);
      setQuantity(1);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setAddFailed(true);
      setTimeout(() => setAddFailed(false), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Price + quantity stepper */}
      <div className="mb-6 flex items-center gap-4">
        <p className="text-3xl font-bold text-amber">{formattedPrice}</p>

        {inStock && (
          <div className="flex items-center rounded-md border-2 border-cream-dark bg-cream">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-sm text-charcoal transition-colors hover:bg-cream-dark disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold text-charcoal">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
              disabled={quantity >= MAX_QTY}
              className="flex h-9 w-9 items-center justify-center rounded-sm text-charcoal transition-colors hover:bg-cream-dark disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Stock badge, description, specs passed from server component */}
      {children}

      {/* Add to Cart button */}
      {inStock ? (
        <Button
          size="lg"
          className="w-full bg-amber text-lg text-white disabled:opacity-50"
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label={`Add ${productName} to cart`}
        >
          {isAdding ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Adding...
            </>
          ) : addFailed ? (
            "Failed — please try again"
          ) : justAdded ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
      ) : (
        <Button
          size="lg"
          className="w-full bg-amber text-lg text-white disabled:opacity-50"
          disabled
          aria-label="Product out of stock"
        >
          Out of Stock
        </Button>
      )}
    </>
  );
}
