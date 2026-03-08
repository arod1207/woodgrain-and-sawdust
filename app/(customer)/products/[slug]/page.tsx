import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/src/sanity/lib/client";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY } from "@/src/sanity/lib/queries";
import type { Product } from "@/src/sanity/lib/types";
import ProductGallery from "@/components/customer/ProductGallery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Play } from "lucide-react";
import ProductActions from "@/components/customer/ProductActions";
import { urlFor } from "@/src/sanity/lib/image";

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

          {/* Price, Quantity + Add to Cart */}
          <ProductActions
            productId={product._id}
            productName={product.name}
            price={product.price}
            inStock={product.inStock}
            formattedPrice={formattedPrice}
            imageUrl={
              product.images?.[0]
                ? urlFor(product.images[0]).width(256).height(256).url()
                : "/placeholder.png"
            }
          >
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
          </ProductActions>
        </div>
      </div>

      {/* TikTok Build Video */}
      {product.tiktokUrl && (
        <div className="mt-16 border-t border-cream-dark pt-16">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-walnut px-8 py-12 text-center sm:flex-row sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber/20">
              <Play className="h-7 w-7 fill-amber text-amber" />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-amber-light">
                Watch the Build
              </p>
              <h2 className="mb-2 text-2xl font-bold text-cream">
                See How This Piece Was Made
              </h2>
              <p className="text-cream/70">
                Follow along on TikTok as this {product.name.toLowerCase()} comes to life from raw lumber to finished piece.
              </p>
            </div>
            <a
              href={product.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-amber px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-light"
            >
              Watch on TikTok
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
