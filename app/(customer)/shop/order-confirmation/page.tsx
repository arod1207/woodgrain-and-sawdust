import Link from "next/link";

export const metadata = {
  title: "Order Confirmed — Woodgrain & Sawdust",
};

export default function OrderConfirmationPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage/20">
        <svg
          className="h-8 w-8 text-sage"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="font-heading mb-3 text-3xl font-bold text-walnut">
        You&apos;re all set!
      </h1>
      <p className="mb-2 text-charcoal-light">
        Your order is confirmed and I&apos;ll be in touch soon with next steps —
        whether that&apos;s coordinating local pickup or getting your cross
        shipped out.
      </p>
      <p className="mb-8 text-sm text-charcoal-light">
        Check your email for a receipt from Stripe.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber/90"
        >
          Back to Shop
        </Link>
        <Link
          href="/plans"
          className="rounded-full border border-walnut px-6 py-3 text-sm font-semibold text-walnut transition-colors hover:bg-cream"
        >
          Browse Free Plans
        </Link>
      </div>
    </main>
  );
}
