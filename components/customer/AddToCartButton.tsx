"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Check, Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  inStock: boolean;
  imageUrl: string;
}

export default function AddToCartButton({
  productId,
  productName,
  price,
  inStock,
  imageUrl,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!inStock) {
    return (
      <Button
        size="lg"
        className="w-full rounded-full bg-amber text-lg text-white hover:bg-amber-light disabled:opacity-50"
        disabled
        aria-label="Product out of stock"
      >
        Out of Stock
      </Button>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      productId,
      name: productName,
      price,
      image: imageUrl,
    });
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Button
      size="lg"
      className="w-full rounded-full bg-amber text-lg text-white hover:bg-amber-light disabled:opacity-50"
      onClick={handleAddToCart}
      disabled={isAdding}
      aria-label={`Add ${productName} to cart`}
    >
      {isAdding ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Adding...
        </>
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
  );
}
