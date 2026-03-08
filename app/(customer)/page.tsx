import Link from 'next/link'
import { client } from '@/src/sanity/lib/client'
import {
  FEATURED_PRODUCTS_QUERY,
  ABOUT_SECTION_QUERY,
  HERO_SECTION_QUERY,
} from '@/src/sanity/lib/queries'
import type {
  ProductCard as ProductCardType,
  AboutSection as AboutSectionType,
  HeroSection as HeroSectionType,
} from '@/src/sanity/lib/types'
import ProductCard from '@/components/customer/ProductCard'
import AboutSection from '@/components/customer/AboutSection'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle,
  Heart,
  Package,
  ExternalLink,
  ImageIcon,
} from 'lucide-react'

export const revalidate = 60

const HomePage = async () => {
  const [featuredProducts, aboutSection, hero] = await Promise.all([
    client.fetch<ProductCardType[]>(FEATURED_PRODUCTS_QUERY),
    client.fetch<AboutSectionType | null>(ABOUT_SECTION_QUERY),
    client.fetch<HeroSectionType | null>(HERO_SECTION_QUERY),
  ])

  const hasFeaturedProducts = featuredProducts && featuredProducts.length > 0

  return (
    <div className="flex flex-col">
      {/* Split Intro Section */}
      <section className="border-b border-cream-dark bg-cream">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row">
            {/* Left: Decorative brand panel */}
            <div className="flex items-center justify-center bg-walnut-dark px-12 py-16 lg:w-2/5 lg:min-h-[520px]">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="border border-amber/40 p-8">
                  <div className="border border-amber/20 p-6">
                    <svg
                      className="h-16 w-16 text-amber"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber">
                    Est. 2024
                  </p>
                  <p className="mt-1 font-heading text-sm text-cream/50">
                    Handcrafted Woodwork
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Text content */}
            <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-16 lg:px-16 lg:py-20">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-amber" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                  {hero?.brandLabel ?? 'Woodgrain & Sawdust'}
                </span>
              </div>

              <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-walnut lg:text-6xl">
                {hero?.heading ?? 'From the Workshop'}
                {(hero?.headingAccent ?? true) && (
                  <>
                    <br />
                    <span className="text-amber-light">
                      {hero?.headingAccent ?? 'to Your Home.'}
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-md text-lg leading-relaxed text-charcoal-light">
                {hero?.subheading ??
                  'Each piece is meticulously crafted from premium hardwoods, bringing warmth and character to your home. Discover the beauty of real wood.'}
              </p>

              <Button
                size="lg"
                className="w-fit rounded-full bg-amber px-8 py-6 text-base text-cream hover:bg-amber-light"
                asChild
              >
                <Link href={hero?.ctaLink ?? '/products'}>
                  {hero?.ctaText ?? 'Browse Collection'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-walnut-dark py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-walnut/50">
            <div className="flex flex-1 items-start gap-4 px-4 py-6 sm:px-8 sm:py-0 sm:first:pl-0">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <h3 className="mb-1 font-semibold text-cream">
                  Premium Materials
                </h3>
                <p className="text-sm text-cream/60">
                  Only the finest hardwoods — walnut, oak, maple, and cherry —
                  for lasting beauty.
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-4 px-4 py-6 sm:px-8 sm:py-0">
              <Heart className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <h3 className="mb-1 font-semibold text-cream">
                  Handcrafted with Care
                </h3>
                <p className="text-sm text-cream/60">
                  Traditional joinery techniques ensure quality that lasts
                  generations.
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-4 px-4 py-6 sm:px-8 sm:py-0 sm:last:pr-0">
              <Package className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <h3 className="mb-1 font-semibold text-cream">
                  Custom Orders Welcome
                </h3>
                <p className="text-sm text-cream/60">
                  We work with you to create pieces tailored to your exact
                  vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-walnut">Featured Pieces</h2>
            <Button
              variant="link"
              asChild
              className="text-amber hover:text-amber-light"
            >
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
            <div className="py-16 text-center">
              <ImageIcon className="mx-auto mb-4 h-10 w-10 text-walnut/20" />
              <p className="mb-1 font-semibold text-walnut">
                No featured products yet
              </p>
              <p className="mb-4 text-sm text-charcoal-light">
                Mark products as &quot;Featured&quot; in Sanity Studio to
                display them here.
              </p>
              <Link
                href="/studio"
                className="inline-flex items-center gap-1.5 text-sm text-amber underline-offset-4 hover:underline"
              >
                Open Sanity Studio
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      {aboutSection && <AboutSection data={aboutSection} />}
    </div>
  )
}

export default HomePage
