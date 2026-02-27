import { client } from "@/src/sanity/lib/client";
import { PRODUCTS_QUERY, PRODUCTS_BY_CATEGORY_QUERY, CATEGORIES_QUERY } from "@/src/sanity/lib/queries";
import type { ProductCard as ProductCardType, Category } from "@/src/sanity/lib/types";
import ProductCard from "@/components/customer/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, ExternalLink } from "lucide-react";

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const { category } = await searchParams;

  const [products, categories] = await Promise.all([
    category
      ? client.fetch<ProductCardType[]>(PRODUCTS_BY_CATEGORY_QUERY, { category })
      : client.fetch<ProductCardType[]>(PRODUCTS_QUERY),
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
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 pb-6">
            <span className="text-sm font-medium text-charcoal">Filter by:</span>
            <Button
              size="sm"
              className={`rounded-full ${!category ? "bg-amber text-white hover:bg-amber-light" : "border border-cream-dark text-charcoal-light hover:border-amber hover:text-amber"}`}
              variant={!category ? "default" : "outline"}
              asChild
            >
              <Link href="/products">All</Link>
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat._id}
                variant="outline"
                size="sm"
                className={`rounded-full ${category === cat.slug ? "bg-amber text-white border-amber hover:bg-amber-light" : "border-cream-dark text-charcoal-light hover:border-amber hover:text-amber"}`}
                asChild
              >
                <Link href={`/products?category=${cat.slug}`}>
                  {cat.name}
                </Link>
              </Button>
            ))}
          </div>
          <Separator className="bg-cream-dark" />
        </div>
      )}

      {/* Products Grid */}
      {hasProducts ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : category ? (
        <Card className="border-cream-dark bg-cream/50">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
              <Package className="h-8 w-8" />
            </div>
            <CardTitle className="mb-2 text-walnut">
              No Products in This Category
            </CardTitle>
            <CardDescription className="mb-4">
              Try browsing all products or selecting a different category.
            </CardDescription>
            <Button className="rounded-full bg-amber hover:bg-amber-light" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber/30 bg-amber/5">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber/10 text-amber">
              <Package className="h-8 w-8" />
            </div>
            <CardTitle className="mb-2 text-walnut">
              No Products Yet
            </CardTitle>
            <CardDescription className="mb-4">
              Products will appear here once added via Sanity Studio.
            </CardDescription>
            <Button className="rounded-full bg-amber hover:bg-amber-light" asChild>
              <Link href="/studio">
                Open Sanity Studio
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsPage;
