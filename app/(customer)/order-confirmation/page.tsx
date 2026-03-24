"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, Download, FileText } from "lucide-react";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const order = useQuery(
    api.orders.getOrderById,
    orderId ? { orderId: orderId as Id<"orders"> } : "skip"
  );

  if (!orderId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-walnut">
          No order found
        </h1>
        <p className="mb-6 text-charcoal-light">
          It looks like you arrived here without completing a checkout.
        </p>
        <Button
          size="lg"
          className="rounded-full bg-amber text-white hover:bg-amber-light"
          asChild
        >
          <Link href="/plans">Browse Plans</Link>
        </Button>
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-walnut">
          Order not found
        </h1>
        <p className="mb-6 text-charcoal-light">
          We couldn&apos;t find this order. It may still be processing.
        </p>
        <Button
          size="lg"
          className="rounded-full bg-amber text-white hover:bg-amber-light"
          asChild
        >
          <Link href="/plans">Browse Plans</Link>
        </Button>
      </div>
    );
  }

  const isPaid = order.status === "paid";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        {isPaid ? (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-sage" />
            <h1 className="mb-2 text-3xl font-bold text-walnut">Thank you!</h1>
            <p className="text-charcoal-light">
              Your cut plan is ready to download.
            </p>
          </>
        ) : (
          <>
            <Clock className="mx-auto mb-4 h-16 w-16 text-amber" />
            <h1 className="mb-2 text-3xl font-bold text-walnut">
              Order received
            </h1>
            <p className="text-charcoal-light">
              Your payment is being processed. This page will update
              automatically.
            </p>
          </>
        )}
      </div>

      <Card className="mb-6 border-cream-dark bg-white">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-walnut">
            Order Details
          </h2>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-charcoal-light" />
            <div className="flex-1">
              <p className="font-medium text-charcoal">{order.planName}</p>
            </div>
            <p className="font-medium text-charcoal">
              {formatCurrency.format(order.price)}
            </p>
          </div>
        </CardContent>
      </Card>

      {isPaid && (
        <Button
          size="lg"
          className="mb-6 w-full rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light"
          asChild
        >
          <a
            href={`/api/download?planId=${order.planId}&orderId=${orderId}`}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Your Cut Plan
          </a>
        </Button>
      )}

      <div className="text-center">
        <Button
          variant="link"
          asChild
          className="text-amber hover:text-amber-light"
        >
          <Link href="/plans">Browse More Plans</Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="mx-auto h-8 w-64" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
