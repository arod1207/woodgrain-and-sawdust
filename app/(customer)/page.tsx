import Link from "next/link";
import { client } from "@/src/sanity/lib/client";
import { FEATURED_PRODUCTS_QUERY } from "@/src/sanity/lib/queries";
import type { ProductCard as ProductCardType } from "@/src/sanity/lib/types";
import ProductCard from "@/components/customer/ProductCard";

export const revalidate = 60;

const HomePage = async () => {
  const featuredProducts = await client.fetch<ProductCardType[]>(
    FEATURED_PRODUCTS_QUERY
  );

  const hasFeaturedProducts = featuredProducts && featuredProducts.length > 0;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-walnut to-walnut-dark px-4">
        <div className="absolute inset-0 bg-[url('/grain-texture.png')] opacity-10" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-cream sm:text-5xl md:text-6xl">
            Handcrafted Wooden
            <br />
            <span className="text-amber-light">Furniture & Decor</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-cream/80 sm:text-xl">
            Each piece is meticulously crafted from premium hardwoods, bringing
            warmth and character to your home. Discover the beauty of real wood.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-amber-light hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-walnut"
            tabIndex={0}
            aria-label="Browse our collection of handcrafted furniture"
          >
            Browse Collection
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-walnut">
            Why Choose Our Woodwork
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-cream-dark bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-walnut">
                Premium Materials
              </h3>
              <p className="text-charcoal-light">
                We source only the finest hardwoods—walnut, oak, maple, and
                cherry—for lasting beauty and durability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-cream-dark bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-walnut">
                Handcrafted with Care
              </h3>
              <p className="text-charcoal-light">
                Every piece is made by hand with traditional joinery techniques,
                ensuring quality that lasts generations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-cream-dark bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-walnut">
                Custom Orders Welcome
              </h3>
              <p className="text-charcoal-light">
                Have a specific vision? We work with you to create custom pieces
                tailored to your exact specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-walnut">Featured Pieces</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-amber transition-colors hover:text-amber-light"
              tabIndex={0}
            >
              View All
            </Link>
          </div>

          {hasFeaturedProducts ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-cream-dark bg-white p-12 text-center">
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
                Featured Products Coming Soon
              </h3>
              <p className="mb-4 text-charcoal-light">
                Add products in Sanity Studio and mark them as &quot;Featured&quot; to
                display them here.
              </p>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber transition-colors hover:text-amber-light"
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
      </section>
    </div>
  );
};

export default HomePage;
