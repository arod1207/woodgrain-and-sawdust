import { client } from "@/src/sanity/lib/client";
import { CROSSES_QUERY } from "@/src/sanity/lib/queries";
import { Cross } from "@/src/sanity/lib/types";
import CrossCard from "@/components/customer/CrossCard";

export const revalidate = 60;

export const metadata = {
  title: "Shop — Woodgrain & Sawdust",
  description:
    "Hand-crafted custom wooden crosses, built one at a time. Each piece is unique.",
};

export default async function ShopPage() {
  const crosses: Cross[] = await client.fetch(CROSSES_QUERY);
  const available = crosses.filter((c) => c.available);
  const sold = crosses.filter((c) => !c.available);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-heading mb-3 text-4xl font-bold text-walnut">
          Custom Crosses
        </h1>
        <p className="mx-auto max-w-lg text-charcoal-light">
          Each cross is hand-built by me, one at a time. What you see here is
          what&apos;s ready to go home with you.
        </p>
      </div>

      {crosses.length === 0 ? (
        <div className="rounded-2xl border border-cream-dark bg-cream p-12 text-center">
          <p className="mb-2 text-lg font-medium text-walnut">
            Nothing for sale right now
          </p>
          <p className="text-charcoal-light">
            Check back soon — I&apos;m always building something new.
          </p>
        </div>
      ) : (
        <>
          {available.length > 0 && (
            <section className="mb-16">
              <div className="flex flex-wrap gap-6">
                {available.map((cross) => (
                  <div key={cross._id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                    <CrossCard cross={cross} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {sold.length > 0 && (
            <section>
              <h2 className="font-heading mb-6 text-xl font-semibold text-charcoal-light">
                Previously Sold
              </h2>
              <div className="flex flex-wrap gap-6 opacity-60">
                {sold.map((cross) => (
                  <div key={cross._id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                    <CrossCard cross={cross} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
