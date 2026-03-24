"use client";

import { Button } from "@/components/ui/button";
import { usePlanCheckout } from "@/hooks/usePlanCheckout";
import { useDeviceId } from "@/hooks/useDeviceId";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Download, CreditCard, Coffee } from "lucide-react";
import type { ReactNode } from "react";

interface PlanActionsProps {
  planId: string;
  price: number;
  formattedPrice: string;
  children: ReactNode;
}

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/woodgrainandsawdust";

export default function PlanActions({
  planId,
  price,
  formattedPrice,
  children,
}: PlanActionsProps) {
  const isFree = price === 0;
  const { handleBuyNow, isCheckingOut, checkoutError } =
    usePlanCheckout(planId);
  const deviceId = useDeviceId();

  const purchasedOrderId = useQuery(
    api.orders.hasUserPurchasedPlan,
    deviceId ? { deviceId, planId } : "skip"
  );

  return (
    <>
      {/* Price */}
      <div className="mb-6">
        <p className="text-3xl font-bold text-amber">
          {isFree ? "Free" : formattedPrice}
        </p>
      </div>

      {children}

      {/* Action buttons */}
      <div className="space-y-3">
        {isFree ? (
          <>
            <Button
              size="lg"
              className="w-full rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light"
              asChild
            >
              <a href={`/api/download?planId=${planId}`}>
                <Download className="mr-2 h-5 w-5" />
                Download Free Plan
              </a>
            </Button>
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-amber/30 px-6 py-3 text-sm font-medium text-amber transition-colors hover:border-amber hover:bg-amber/5"
            >
              <Coffee className="h-4 w-4" />
              Enjoy this plan? Buy me a coffee!
            </a>
          </>
        ) : purchasedOrderId ? (
          <Button
            size="lg"
            className="w-full rounded-full bg-sage px-8 py-6 text-base text-white hover:bg-sage-light"
            asChild
          >
            <a
              href={`/api/download?planId=${planId}&orderId=${purchasedOrderId}`}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Your Plan
            </a>
          </Button>
        ) : (
          <>
            {checkoutError && (
              <p className="text-sm text-red-600">{checkoutError}</p>
            )}
            <Button
              size="lg"
              className="w-full rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light disabled:opacity-50"
              onClick={handleBuyNow}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Buy Now {formattedPrice}
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
