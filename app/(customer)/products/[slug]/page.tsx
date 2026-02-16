import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/src/sanity/lib/client";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY } from "@/src/sanity/lib/queries";
import type { Product } from "@/src/sanity/lib/types";
import ProductGallery from "@/components/customer/ProductGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";

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
              <Badge variant="outline" className="gap-1.5 border-sage/30 bg-sage/10 text-sage">
                <CheckCircle className="h-4 w-4" />
                In Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5 border-charcoal-light/30 bg-charcoal/5 text-charcoal-light">
                <XCircle className="h-4 w-4" />
                Out of Stock
              </Badge>
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
          <Card className="mb-8 border-cream-dark bg-cream">
            <CardContent className="p-6">
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
            </CardContent>
          </Card>

          {/* Add to Cart Button (placeholder for Phase 3) */}
          <Button
            size="lg"
            className="w-full rounded-full bg-amber text-lg text-white hover:bg-amber-light disabled:opacity-50"
            disabled={!product.inStock}
            aria-label={
              product.inStock
                ? `Add ${product.name} to cart`
                : "Product out of stock"
            }
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <p className="mt-3 text-center text-sm text-charcoal-light">
            Cart functionality coming in Phase 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
