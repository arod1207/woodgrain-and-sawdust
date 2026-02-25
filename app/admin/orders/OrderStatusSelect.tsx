"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "./_actions";
import { Id } from "@/convex/_generated/dataModel";

type OrderStatus = "pending" | "paid" | "failed";

interface OrderStatusSelectProps {
  orderId: Id<"orders">;
  currentStatus: OrderStatus;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  paid: "bg-sage/20 text-sage border-sage/30",
  pending: "bg-amber/20 text-amber border-amber/30",
  failed: "bg-red-100 text-red-600 border-red-200",
};

const OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
];

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: OrderStatus) => {
    const previous = status;
    setStatus(newStatus);
    setError(null);
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch {
        setStatus(previous);
        setError("Update failed");
        setTimeout(() => setError(null), 4000);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        disabled={isPending}
        className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium capitalize transition-opacity ${STATUS_STYLES[status]} ${isPending ? "opacity-50" : ""}`}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
