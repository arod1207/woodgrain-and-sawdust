import Link from "next/link";
import { client } from "@/src/sanity/lib/client";
import { FEATURED_PRODUCTS_QUERY } from "@/src/sanity/lib/queries";
import type { ProductCard as ProductCardType } from "@/src/sanity/lib/types";
import ProductCard from "@/components/customer/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Heart, Package, ExternalLink } from "lucide-react";

export const revalidate = 60;

const HomePage = async () => {
  const featuredProducts = await client.fetch<ProductCardType[]>(
    FEATURED_PRODUCTS_QUERY
  );

  const hasFeaturedProducts = featuredProducts && featuredProducts.length > 0;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
<section className="texture-vignette relative flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-walnut to-walnut-dark px-4 overflow-hidden">
  {/* Background image layer – only this div gets the opacity */}
  <div
    className={`
      absolute inset-0 
      bg-[url('/hero.jpg')] 
      bg-cover bg-center opacity-25
    `}
  />

  {/* Optional: add a subtle dark overlay if text contrast still needs help */}
  {/* <div className="absolute inset-0 bg-black/20" /> */}  {/* uncomment if needed */}

  <div className="relative z-10 mx-auto max-w-4xl text-center">
    <p className="font-heading mb-4 text-sm font-semibold uppercase tracking-widest text-amber-light">
      Woodgrain and Sawdust
    </p>
    <h1 className="mb-6 text-4xl font-bold tracking-tight text-cream sm:text-5xl md:text-6xl">
      From the Workshop
      <br />
      <span className="text-amber-light">to Your Home.</span>
    </h1>
    <p className="mx-auto mb-8 max-w-2xl text-lg text-cream/80 sm:text-xl">
      Each piece is meticulously crafted from premium hardwoods, bringing
      warmth and character to your home. Discover the beauty of real wood.
    </p>
    <Button
      size="lg"
      className="bg-amber px-8 py-6 text-lg"
      asChild
    >
      <Link href="/products">
        Browse Collection
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </Button>
  </div>
</section>

      {/* Features Section */}
      <section className="texture-grain py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-walnut">
            Why Choose Our Woodwork
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="border-cream-dark transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <CardTitle className="mb-2 text-walnut">Premium Materials</CardTitle>
                <CardDescription className="text-charcoal-light">
                  We source only the finest hardwoods—walnut, oak, maple, and
                  cherry—for lasting beauty and durability.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-cream-dark transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
                  <Heart className="h-6 w-6" />
                </div>
                <CardTitle className="mb-2 text-walnut">Handcrafted with Care</CardTitle>
                <CardDescription className="text-charcoal-light">
                  Every piece is made by hand with traditional joinery techniques,
                  ensuring quality that lasts generations.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-cream-dark transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
                  <Package className="h-6 w-6" />
                </div>
                <CardTitle className="mb-2 text-walnut">Custom Orders Welcome</CardTitle>
                <CardDescription className="text-charcoal-light">
                  Have a specific vision? We work with you to create custom pieces
                  tailored to your exact specifications.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="texture-grain bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-walnut">Featured Pieces</h2>
            <Button variant="link" asChild className="text-amber hover:text-amber-light">
              <Link href="/products">View All</Link>
            </Button>
          </div>

          {hasFeaturedProducts ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="border-cream-dark">
              <CardContent className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber/10 text-amber">
                  <Package className="h-8 w-8" />
                </div>
                <CardTitle className="mb-2 text-walnut">
                  Featured Products Coming Soon
                </CardTitle>
                <CardDescription className="mb-4">
                  Add products in Sanity Studio and mark them as &quot;Featured&quot; to
                  display them here.
                </CardDescription>
                <Button variant="link" asChild className="text-amber hover:text-amber-light">
                  <Link href="/studio">
                    Open Sanity Studio
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
