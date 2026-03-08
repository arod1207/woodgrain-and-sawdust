import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/src/sanity/lib/image";
import type { ProductCard as ProductCardType } from "@/src/sanity/lib/types";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ImageIcon } from "lucide-react";

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
      className="group block focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 rounded-lg"
      aria-label={`View ${name} details - ${formattedPrice}`}
    >
      <div className="overflow-hidden rounded-lg border-2 border-cream-dark bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Image — square container, full image visible via object-contain */}
        <div className="relative aspect-square overflow-hidden bg-cream-dark">
          {image?.asset ? (
            <Image
              src={urlFor(image).width(600).auto("format").url()}
              alt={image.alt || name}
              width={600}
              height={600}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
              blurDataURL={image.asset.metadata?.lqip}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-walnut/30">
              <ImageIcon className="h-16 w-16" />
            </div>
          )}

          {/* Out of stock badge */}
          {!inStock && (
            <Badge
              variant="secondary"
              className="absolute left-2 top-2 bg-charcoal/80 text-white hover:bg-charcoal/80"
            >
              Out of Stock
            </Badge>
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
              <ChevronRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
