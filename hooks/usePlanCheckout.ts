"use client";

import { useState } from "react";
import { useDeviceId } from "./useDeviceId";

export function usePlanCheckout(planId: string) {
  const deviceId = useDeviceId();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleBuyNow() {
    if (!deviceId) return;
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, deviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status < 500
            ? (data.error ?? "Request failed")
            : "Something went wrong. Please try again."
        );
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsCheckingOut(false);
    }
  }

  return { handleBuyNow, isCheckingOut, checkoutError, deviceId };
}
