import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/src/sanity/lib/client";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY } from "@/src/sanity/lib/queries";
import type { Product } from "@/src/sanity/lib/types";
import ProductGallery from "@/components/customer/ProductGallery";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export const generateStaticParams = async () => {
  const slugs = await client.fetch<{ slug: string }[]>(PRODUCT_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
};

export const generateMetadata = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await client.fetch<Product>(PRODUCT_QUERY, { slug });

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Woodgrain & Sawdust`,
    description: product.description,
  };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await client.fetch<Product>(PRODUCT_QUERY, { slug });

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const woodTypeLabel =
    product.woodType.charAt(0).toUpperCase() + product.woodType.slice(1);

  const finishLabel = product.finish
    ? product.finish
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : null;

  const formatDimensions = () => {
    if (!product.dimensions) return null;
    const { length, width, height, unit } = product.dimensions;
    if (!length && !width && !height) return null;

    const parts = [];
    if (length) parts.push(`${length}${unit === "cm" ? "cm" : '"'} L`);
    if (width) parts.push(`${width}${unit === "cm" ? "cm" : '"'} W`);
    if (height) parts.push(`${height}${unit === "cm" ? "cm" : '"'} H`);

    return parts.join(" × ");
  };

  const dimensions = formatDimensions();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link
              href="/"
              className="text-charcoal-light transition-colors hover:text-amber"
            >
              Home
            </Link>
          </li>
          <li className="text-charcoal-light">/</li>
          <li>
            <Link
              href="/products"
              className="text-charcoal-light transition-colors hover:text-amber"
            >
              Products
            </Link>
          </li>
          <li className="text-charcoal-light">/</li>
          <li className="font-medium text-walnut">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category */}
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="mb-2 text-sm font-medium text-amber transition-colors hover:text-amber-light"
            >
              {product.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold text-walnut sm:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <p className="mb-6 text-3xl font-bold text-amber">{formattedPrice}</p>

          {/* Stock Status */}
          <div className="mb-6">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-sage">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-light">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-walnut">
              Description
            </h2>
            <p className="whitespace-pre-line text-charcoal-light">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="mb-8 rounded-lg border border-cream-dark bg-cream p-6">
            <h2 className="mb-4 text-lg font-semibold text-walnut">
              Specifications
            </h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-charcoal-light">
                  Wood Type
                </dt>
                <dd className="text-charcoal">{woodTypeLabel}</dd>
              </div>
              {finishLabel && (
                <div>
                  <dt className="text-sm font-medium text-charcoal-light">
                    Finish
                  </dt>
                  <dd className="text-charcoal">{finishLabel}</dd>
                </div>
              )}
              {dimensions && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-charcoal-light">
                    Dimensions
                  </dt>
                  <dd className="text-charcoal">{dimensions}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Add to Cart Button (placeholder for Phase 3) */}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-full bg-amber px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-amber-light focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!product.inStock}
            tabIndex={0}
            aria-label={
              product.inStock
                ? `Add ${product.name} to cart`
                : "Product out of stock"
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <p className="mt-3 text-center text-sm text-charcoal-light">
            Cart functionality coming in Phase 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
