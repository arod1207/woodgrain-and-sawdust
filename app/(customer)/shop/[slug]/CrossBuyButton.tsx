"use client";

import { useState } from "react";

interface CrossBuyButtonProps {
  crossId: string;
  available: boolean;
}

export default function CrossBuyButton({ crossId, available }: CrossBuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crossId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      // Keep loading=true — component is destroyed on navigation
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleBuy}
        disabled={!available || loading}
        className="rounded-full bg-amber px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Redirecting…" : available ? "Buy Now" : "Sold Out"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
