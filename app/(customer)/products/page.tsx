import { client } from "@/src/sanity/lib/client";
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from "@/src/sanity/lib/queries";
import type { ProductCard as ProductCardType, Category } from "@/src/sanity/lib/types";
import ProductCard from "@/components/customer/ProductCard";
import Link from "next/link";

export const revalidate = 60;

const ProductsPage = async () => {
  const [products, categories] = await Promise.all([
    client.fetch<ProductCardType[]>(PRODUCTS_QUERY),
    client.fetch<Category[]>(CATEGORIES_QUERY),
  ]);

  const hasProducts = products && products.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-walnut sm:text-4xl">
          Our Collection
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-charcoal-light">
          Browse our handcrafted wooden furniture and home decor. Each piece is
          made with care using premium hardwoods.
        </p>
      </div>

      {/* Categories Filter */}
      {categories && categories.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-cream-dark pb-6">
          <span className="text-sm font-medium text-charcoal">Filter by:</span>
          <Link
            href="/products"
            className="rounded-full border border-amber bg-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-light"
            tabIndex={0}
            aria-label="Show all products"
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products?category=${category.slug}`}
              className="rounded-full border border-cream-dark px-4 py-2 text-sm font-medium text-charcoal-light transition-colors hover:border-amber hover:text-amber"
              tabIndex={0}
              aria-label={`Filter by ${category.name}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {hasProducts ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-amber/30 bg-amber/5 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber/10 text-amber">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-walnut">
            No Products Yet
          </h3>
          <p className="mb-4 text-charcoal-light">
            Products will appear here once added via Sanity Studio.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-light"
            tabIndex={0}
          >
            Open Sanity Studio
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
