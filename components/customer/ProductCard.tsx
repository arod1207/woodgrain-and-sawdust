import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/src/sanity/lib/image";
import type { ProductCard as ProductCardType } from "@/src/sanity/lib/types";

interface ProductCardProps {
  product: ProductCardType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, slug, price, woodType, inStock, image } = product;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const woodTypeLabel =
    woodType.charAt(0).toUpperCase() + woodType.slice(1);

  return (
    <Link
      href={`/products/${slug}`}
      className="group block overflow-hidden rounded-lg border border-cream-dark bg-white shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
      tabIndex={0}
      aria-label={`View ${name} details - ${formattedPrice}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        {image?.asset ? (
          <Image
            src={urlFor(image).width(400).height(400).url()}
            alt={image.alt || name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={image.asset.metadata?.lqip}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-walnut/30">
            <svg
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Out of stock badge */}
        {!inStock && (
          <div className="absolute left-2 top-2 rounded-full bg-charcoal/80 px-3 py-1 text-xs font-medium text-white">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 truncate text-lg font-semibold text-walnut group-hover:text-amber">
          {name}
        </h3>
        <p className="mb-3 text-sm text-charcoal-light">{woodTypeLabel}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber">{formattedPrice}</span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-amber text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
