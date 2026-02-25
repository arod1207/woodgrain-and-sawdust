"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export function useCheckout() {
  const { items, deviceId } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleCheckout() {
    // deviceId is hydrated from localStorage in an effect — guard against the
    // brief window before hydration completes where it would be an empty string.
    if (!deviceId) return;

    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ productId, quantity }) => ({ productId, quantity })),
          deviceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // For 4xx errors, surface the API's user-friendly message.
        // For 5xx or unexpected errors, use a generic message to avoid leaking internals.
        const message =
          response.status < 500
            ? (data.error ?? "Request failed")
            : "Something went wrong. Please try again.";
        throw new Error(message);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      // Always reset so the button is not permanently frozen if the user
      // presses back from Stripe's checkout page.
      setIsCheckingOut(false);
    }
  }

  return { handleCheckout, isCheckingOut, checkoutError };
}
