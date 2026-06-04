import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Ruler, TreePine, Truck } from "lucide-react";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { client } from "@/src/sanity/lib/client";
import { CROSS_QUERY, CROSS_SLUGS_QUERY } from "@/src/sanity/lib/queries";
import { Cross } from "@/src/sanity/lib/types";
import CrossBuyButton from "./CrossBuyButton";

function toPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((b) =>
      b._type === "block" && Array.isArray(b.children)
        ? b.children.map((c) => (c as { text?: string }).text ?? "").join("")
        : ""
    )
    .join(" ");
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(CROSS_SLUGS_QUERY);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cross: Cross | null = await client.fetch(CROSS_QUERY, { slug });
  if (!cross) return {};
  return {
    title: `${cross.name} — Woodgrain & Sawdust`,
    description: cross.description ? toPlainText(cross.description) : "A hand-built custom wooden cross.",
  };
}

export default async function CrossDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cross: Cross | null = await client.fetch(CROSS_QUERY, { slug });
  if (!cross) notFound();

  const image = cross.images?.[0];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-1 text-sm text-charcoal-light transition-colors hover:text-amber"
      >
        ← Back to Shop
      </Link>

      {/* Main layout */}
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream">
            {image?.asset?.url ? (
              <Image
                src={image.asset.url}
                alt={image.alt ?? cross.name}
                fill
                className="object-contain"
                placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={image.asset.metadata?.lqip}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-charcoal-light">
                No photo yet
              </div>
            )}
            {!cross.available && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full bg-walnut px-6 py-3 text-lg font-semibold text-cream">
                  Sold
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-6">
          <div>
            <h1 className="font-heading mb-2 text-3xl font-bold text-walnut lg:text-4xl">
              {cross.name}
            </h1>
            <span className="text-3xl font-bold text-amber">
              ${cross.price.toFixed(2)}
            </span>
          </div>

          {cross.description && (
            <div className="leading-relaxed text-charcoal-light [&_strong]:font-semibold [&_u]:underline">
              <PortableText value={cross.description} />
            </div>
          )}

          {/* Details */}
          {(cross.woodType || cross.dimensions || cross.shippingRate != null) && (
            <div className="divide-y divide-cream-dark rounded-xl border border-cream-dark bg-cream">
              {cross.woodType && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <TreePine className="h-4 w-4 shrink-0 text-amber" />
                  <span className="text-sm text-charcoal-light">Wood</span>
                  <span className="ml-auto text-sm font-medium text-charcoal">{cross.woodType}</span>
                </div>
              )}
              {cross.dimensions && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Ruler className="h-4 w-4 shrink-0 text-amber" />
                  <span className="text-sm text-charcoal-light">Size</span>
                  <span className="ml-auto text-sm font-medium text-charcoal">{cross.dimensions}</span>
                </div>
              )}
              {cross.shippingRate != null && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Truck className="h-4 w-4 shrink-0 text-amber" />
                  <span className="text-sm text-charcoal-light">Shipping</span>
                  <span className="ml-auto text-sm font-medium text-charcoal">
                    {`$${cross.shippingRate.toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>
          )}

          <CrossBuyButton crossId={cross._id} available={cross.available} />
        </div>
      </div>

      {/* TikTok video */}
      {cross.tiktokUrl && (
        <section className="mt-16">
          <a
            href={cross.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex overflow-hidden rounded-2xl border border-cream-dark shadow-sm"
          >
            {image?.asset?.url && (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${image.asset.url})` }}
              />
            )}
            {!image?.asset?.url && <div className="absolute inset-0 bg-walnut" />}
            <div className="absolute inset-0 bg-black/55 transition-colors group-hover:bg-black/65" />

            <div className="relative flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
              <svg
                viewBox="0 0 24 24"
                className="h-12 w-12 fill-white drop-shadow-lg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
              </svg>
              <div>
                <p className="text-lg font-bold text-white">Get a Closer Look on TikTok</p>
                <p className="mt-1 text-sm text-white/70">Opens TikTok in a new tab</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/60 transition-colors group-hover:bg-white/30">
                <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </a>
        </section>
      )}
    </main>
  );
}
