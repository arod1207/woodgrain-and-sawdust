import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { client } from "@/src/sanity/lib/client";
import { urlFor } from "@/src/sanity/lib/image";
import { isShopEnabled } from "@/lib/features";
import {
  FEATURED_CUT_PLANS_QUERY,
  ABOUT_SECTION_QUERY,
  HERO_SECTION_QUERY,
  FEATURES_SECTION_QUERY,
  HOW_IT_WORKS_SECTION_QUERY,
  FEATURED_PLANS_SECTION_QUERY,
} from "@/src/sanity/lib/queries";
import type {
  CutPlanCard as CutPlanCardType,
  AboutSection as AboutSectionType,
  HeroSection as HeroSectionType,
  FeaturesSection as FeaturesSectionType,
  HowItWorksSection as HowItWorksSectionType,
  FeaturedPlansSection as FeaturedPlansSectionType,
  Feature,
  HowItWorksStep,
  SectionImage,
} from "@/src/sanity/lib/types";
import CutPlanCard from "@/components/customer/CutPlanCard";
import AboutSection from "@/components/customer/AboutSection";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Box,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Hammer,
  Heart,
  Layers,
  MousePointerClick,
  Package,
  PencilRuler,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Star,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const DESIGNER_NEW_URL = "https://designer.woodgrainandsawdust.com/new";

const ICON_MAP: Record<string, LucideIcon> = {
  Box,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Hammer,
  Heart,
  Layers,
  MousePointerClick,
  Package,
  PencilRuler,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Star,
  Wrench,
  Zap,
};

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: "Ruler",
    title: "Your Size, Not Ours",
    description:
      "Drag a board's end or type 30 1/2\" — fractions are how it talks. No CAD degree required.",
  },
  {
    icon: "ClipboardList",
    title: "A Cut List That's Actually Right",
    description:
      "Every piece at the size you really cut it, miters and dados included. Print it big for the shop.",
  },
  {
    icon: "ShoppingCart",
    title: "Know What to Buy",
    description:
      "A shopping list of real boards and hardware, so you only make one trip to the lumber yard. (Okay, maybe two.)",
  },
];

const DEFAULT_STEPS: HowItWorksStep[] = [
  {
    title: "Start from a plan — or one board",
    description:
      "Open a ready-made project like a planter or bookshelf, or drag a 2x4 onto the workspace and freestyle it.",
  },
  {
    title: "Make it fit your space",
    description:
      "Resize, trim and join boards. Spin it around in 3D or flip to front, side and top drawings with every measurement on them.",
  },
  {
    title: "Take it to the shop",
    description:
      "Get your cut list and shopping list, print them, and go make some sawdust.",
  },
];

const DEFAULT_SEO_TITLE =
  "Woodgrain & Sawdust | Design Your Build, Get Your Cut List";
const DEFAULT_SEO_DESCRIPTION =
  "Design woodworking projects at your size in minutes — drag boards, trim them, and get a cut list and shopping list you can take straight to the lumber yard. Free to start.";

interface ResolvedImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Use the Sanity image when one is set, otherwise the bundled screenshot. */
const resolveImage = (
  image: SectionImage | undefined,
  fallback: ResolvedImage
): ResolvedImage => {
  if (!image?.asset) return fallback;
  const dimensions = image.asset.metadata?.dimensions;
  return {
    src: urlFor(image).width(1600).auto("format").url(),
    width: dimensions?.width ?? fallback.width,
    height: dimensions?.height ?? fallback.height,
    alt: image.alt ?? fallback.alt,
  };
};

/** Links to other sites (like the Designer) use a plain <a>; site pages use <Link>. */
const isExternal = (href: string) => /^https?:\/\//.test(href);

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const hero = await client.fetch<HeroSectionType | null>(HERO_SECTION_QUERY);
    return {
      title: hero?.seoTitle ?? DEFAULT_SEO_TITLE,
      description: hero?.seoDescription ?? DEFAULT_SEO_DESCRIPTION,
    };
  } catch (error) {
    console.error("Failed to fetch SEO metadata from Sanity:", error);
    return { title: DEFAULT_SEO_TITLE, description: DEFAULT_SEO_DESCRIPTION };
  }
}

const HomePage = async () => {
  const [featuredPlans, aboutSection, hero, featuresSection, howItWorks, featuredPlansConfig] =
    await Promise.all([
      client.fetch<CutPlanCardType[]>(FEATURED_CUT_PLANS_QUERY),
      client.fetch<AboutSectionType | null>(ABOUT_SECTION_QUERY),
      client.fetch<HeroSectionType | null>(HERO_SECTION_QUERY),
      client.fetch<FeaturesSectionType | null>(FEATURES_SECTION_QUERY),
      client.fetch<HowItWorksSectionType | null>(HOW_IT_WORKS_SECTION_QUERY),
      client.fetch<FeaturedPlansSectionType | null>(FEATURED_PLANS_SECTION_QUERY),
    ]);

  const features = featuresSection?.features ?? DEFAULT_FEATURES;
  const steps = howItWorks?.steps ?? DEFAULT_STEPS;
  const heroCtaLink = hero?.ctaLink ?? DESIGNER_NEW_URL;
  const heroSecondaryLink = hero?.secondaryCtaLink ?? "#how-it-works";
  const stepsCtaLink = howItWorks?.ctaLink ?? DESIGNER_NEW_URL;
  const heroImage = resolveImage(hero?.heroImage, {
    src: "/designer/hero.jpg",
    width: 1600,
    height: 1000,
    alt: "A 24 x 24 raised planter in the Designer, shown in 3D with its width, depth and height measured",
  });
  const stepsImage = resolveImage(howItWorks?.image, {
    src: "/designer/cutlist.jpg",
    width: 1356,
    height: 1555,
    alt: "The Designer's cut list for a 24 x 24 raised planter, grouped by board with every piece's final size",
  });
  const availablePlans = featuredPlans?.filter((plan) => !plan.comingSoon) ?? [];

  return (
    <div className="flex flex-col">
      {/* Designer Hero */}
      <section className="overflow-hidden border-b border-cream-dark bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-8 lg:w-5/12">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-8 bg-amber" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                {hero?.brandLabel ?? "The Woodgrain & Sawdust Designer"}
              </span>
            </div>

            <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-walnut lg:text-6xl">
              {hero?.heading ?? "Design It Your Size."}
              {(hero?.headingAccent ?? true) && (
                <>
                  <br />
                  <span className="text-amber-light">
                    {hero?.headingAccent ?? "Get the Cut List."}
                  </span>
                </>
              )}
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-charcoal-light">
              {hero?.subheading ??
                "Drag boards onto a workspace, trim them, join them — and walk away with a cut list and shopping list you can take straight to the lumber yard. No CAD experience needed. No math headaches either."}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="w-fit rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light"
                asChild
              >
                {isExternal(heroCtaLink) ? (
                  <a href={heroCtaLink}>
                    {hero?.ctaText ?? "Start designing — it's free"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                ) : (
                  <Link href={heroCtaLink}>
                    {hero?.ctaText ?? "Start designing — it's free"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </Button>
              <Button
                variant="link"
                asChild
                className="w-fit text-base text-walnut hover:text-amber"
              >
                {isExternal(heroSecondaryLink) ? (
                  <a href={heroSecondaryLink}>
                    {hero?.secondaryCtaText ?? "See how it works"}
                  </a>
                ) : (
                  <Link href={heroSecondaryLink}>
                    {hero?.secondaryCtaText ?? "See how it works"}
                  </Link>
                )}
              </Button>
            </div>

            <p className="text-sm text-charcoal-light/80">
              {hero?.footnote ??
                "Free forever for a real project. No card needed to start."}
            </p>
          </div>

          <div className="w-full lg:w-7/12">
            <a
              href={heroCtaLink}
              className="block overflow-hidden rounded-2xl border border-cream-dark shadow-2xl shadow-walnut/20 transition-transform hover:-translate-y-1"
              aria-label="Open the Designer"
            >
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                width={heroImage.width}
                height={heroImage.height}
                priority
                className="h-auto w-full"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Designer Features Strip */}
      <section className="bg-walnut-dark py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-walnut/50">
            {features.map(({ icon, title, description }) => {
              const Icon = ICON_MAP[icon] ?? FileText;
              return (
                <div
                  key={title}
                  className="flex flex-1 items-start gap-4 py-6 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                  <div>
                    <h3 className="mb-1 font-semibold text-cream">{title}</h3>
                    <p className="text-sm text-cream/60">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-16 bg-cream py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:gap-20 lg:px-8">
          <div className="flex flex-1 flex-col gap-10">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                <PencilRuler className="h-4 w-4" />
                {howItWorks?.label ?? "How it works"}
              </span>
              <h2 className="font-heading text-4xl font-bold text-walnut lg:text-5xl">
                {howItWorks?.heading ??
                  "From \u201cI wonder if\u2026\u201d to a cut list in minutes"}
              </h2>
            </div>

            <ol className="flex flex-col gap-8">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="font-heading text-3xl font-bold text-amber/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-walnut">
                      {step.title}
                    </h3>
                    <p className="leading-relaxed text-charcoal-light">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Button
              size="lg"
              className="w-fit rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light"
              asChild
            >
              {isExternal(stepsCtaLink) ? (
                <a href={stepsCtaLink}>
                  <MousePointerClick className="mr-2 h-5 w-5" />
                  {howItWorks?.ctaText ?? "Try the Designer"}
                </a>
              ) : (
                <Link href={stepsCtaLink}>
                  <MousePointerClick className="mr-2 h-5 w-5" />
                  {howItWorks?.ctaText ?? "Try the Designer"}
                </Link>
              )}
            </Button>
          </div>

          <div className="w-full max-w-md shrink-0 lg:w-5/12">
            <div className="overflow-hidden rounded-2xl border border-cream-dark shadow-xl shadow-walnut/15">
              <Image
                src={stepsImage.src}
                alt={stepsImage.alt}
                width={stepsImage.width}
                height={stepsImage.height}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Free Plans — starting points for the Designer */}
      {availablePlans.length > 0 && (
        <section className="bg-cream-dark py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                  <Box className="h-4 w-4" />
                  {featuredPlansConfig?.label ?? "Free plans"}
                </span>
                <h2 className="text-3xl font-bold text-walnut">
                  {featuredPlansConfig?.heading ?? "Prefer a head start?"}
                </h2>
                <p className="mt-2 max-w-xl text-charcoal-light">
                  {featuredPlansConfig?.description ??
                    "Open a free plan in the Designer and tweak it to fit your patio, porch or that one weird corner — steps, cut list and shopping list included."}
                </p>
              </div>
              <Button
                variant="link"
                asChild
                className="w-fit px-0 text-amber hover:text-amber-light"
              >
                <Link href={featuredPlansConfig?.viewAllLink ?? "/plans"}>
                  {featuredPlansConfig?.viewAllText ?? "View all plans"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {availablePlans.map((plan) => (
                <CutPlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Crosses Section */}
      {isShopEnabled() && (
        <section className="bg-walnut py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
              {/* Text */}
              <div className="flex-1 text-center lg:text-left">
                <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                  Now Available
                </span>
                <h2 className="font-heading mb-4 text-4xl font-bold text-cream lg:text-5xl">
                  Hand-Built Custom Crosses
                </h2>
                <p className="mb-8 max-w-lg leading-relaxed text-cream/70">
                  A few people reached out after seeing my builds and asked if I
                  sell them — so now I do. Each cross is built by me, one at a
                  time. What you see in the shop is exactly what&apos;s available
                  and ready to go home with you.
                </p>
                <Button
                  size="lg"
                  className="rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber/90"
                  asChild
                >
                  <Link href="/shop">
                    Shop Crosses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Feature pills */}
              <div className="flex shrink-0 flex-col gap-4">
                {[
                  { icon: Hammer, label: "Built by hand, one at a time" },
                  { icon: Package, label: "Ships anywhere in the US" },
                  { icon: Heart, label: "Each one is a little different" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-2xl bg-walnut-dark/50 px-6 py-4"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-amber" />
                    <span className="text-sm font-medium text-cream/80">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {aboutSection && <AboutSection data={aboutSection} />}
    </div>
  );
};

export default HomePage;
