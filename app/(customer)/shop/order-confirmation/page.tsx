import Link from "next/link";
import Stripe from "stripe";

export const metadata = {
  title: "Order Confirmed — Woodgrain & Sawdust",
};

async function getSessionDetails(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = session_id ? await getSessionDetails(session_id) : null;

  const name =
    session?.collected_information?.shipping_details?.name ??
    session?.customer_details?.name ??
    null;
  const addr =
    session?.collected_information?.shipping_details?.address ??
    null;

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
        Your order is confirmed and I&apos;ll be in touch soon with shipping
        details.
      </p>
      <p className="mb-8 text-sm text-charcoal-light">
        Check your email for a receipt from Stripe.
      </p>

      {addr && (
        <div className="mb-8 rounded-xl border border-cream-dark bg-cream px-6 py-5 text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Shipping to
          </p>
          {name && (
            <p className="font-semibold text-walnut">{name}</p>
          )}
          <p className="text-sm text-charcoal-light">
            {addr.line1}
            {addr.line2 ? `, ${addr.line2}` : ""}
          </p>
          <p className="text-sm text-charcoal-light">
            {addr.city}, {addr.state} {addr.postal_code}
          </p>
        </div>
      )}

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
