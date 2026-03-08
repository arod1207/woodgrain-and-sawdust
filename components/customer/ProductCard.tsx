import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/src/sanity/lib/image";
import type { ProductCard as ProductCardType } from "@/src/sanity/lib/types";
import { ImageIcon } from "lucide-react";

interface ProductCardProps {
  product: ProductCardType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, slug, price, woodType, inStock, image } = product;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const woodTypeLabel = woodType.charAt(0).toUpperCase() + woodType.slice(1);

  return (
    <Link
      href={`/products/${slug}`}
      className="group block focus:outline-none"
      aria-label={`View ${name} details - ${formattedPrice}`}
    >
      {/* Image — full bleed, no border or shadow */}
      <div className="relative aspect-square overflow-hidden bg-white">
        {image?.asset ? (
          <Image
            src={urlFor(image).width(600).auto("format").url()}
            alt={image.alt || name}
            width={600}
            height={600}
            className="w-full h-full object-scale-down transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={image.asset.metadata?.lqip}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-walnut/20">
            <ImageIcon className="h-16 w-16" />
          </div>
        )}

        {!inStock && (
          <span className="absolute left-3 top-3 bg-charcoal/80 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-white">
            Out of Stock
          </span>
        )}
      </div>

      {/* Text below image */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-base font-semibold text-walnut transition-colors group-hover:text-amber">
            {name}
          </h3>
          <span className="shrink-0 text-sm font-medium text-charcoal-light">
            {formattedPrice}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-charcoal-light/70">{woodTypeLabel}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
