import Link from "next/link";
import Image from "next/image";
import { Cross } from "@/src/sanity/lib/types";

interface CrossCardProps {
  cross: Cross;
}

export default function CrossCard({ cross }: CrossCardProps) {
  const image = cross.images?.[0];

  return (
    <Link
      href={`/shop/${cross.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-cream">
        {image?.asset?.url ? (
          <Image
            src={image.asset.url}
            alt={image.alt ?? cross.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={image.asset.metadata?.lqip}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-charcoal-light">
            No photo yet
          </div>
        )}
        {!cross.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-walnut px-4 py-2 text-sm font-semibold text-cream">
              Sold
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold text-walnut">
            {cross.name}
          </h2>
          <span className="text-lg font-bold text-amber">
            ${cross.price.toFixed(2)}
          </span>
        </div>

        {cross.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-charcoal-light">
            {cross.description
              .map((b) =>
                b._type === "block" && Array.isArray(b.children)
                  ? b.children.map((c) => (c as { text?: string }).text ?? "").join("")
                  : ""
              )
              .join(" ")}
          </p>
        )}

        <span className="mt-auto pt-2 text-sm font-medium text-amber group-hover:underline">
          {cross.available ? "View details →" : "View →"}
        </span>
      </div>
    </Link>
  );
}
