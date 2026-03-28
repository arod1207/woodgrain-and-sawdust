import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/src/sanity/lib/client";
import {
  FEATURED_CUT_PLANS_QUERY,
  ABOUT_SECTION_QUERY,
  HERO_SECTION_QUERY,
  FEATURES_SECTION_QUERY,
  FEATURED_PLANS_SECTION_QUERY,
} from "@/src/sanity/lib/queries";
import type {
  CutPlanCard as CutPlanCardType,
  AboutSection as AboutSectionType,
  HeroSection as HeroSectionType,
  FeaturesSection as FeaturesSectionType,
  FeaturedPlansSection as FeaturedPlansSectionType,
  Feature,
} from "@/src/sanity/lib/types";
import CutPlanCard from "@/components/customer/CutPlanCard";
import AboutSection from "@/components/customer/AboutSection";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  Layers,
  Download,
  Ruler,
  Hammer,
  Star,
  ShieldCheck,
  Zap,
  Heart,
  Clock,
  Wrench,
  Package,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Layers,
  Download,
  Ruler,
  Hammer,
  Star,
  ShieldCheck,
  Zap,
  Heart,
  Clock,
  Wrench,
  Package,
};

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: "FileText",
    title: "Detailed Plans",
    description:
      "Step-by-step cut lists, dimensions, and assembly instructions for every project.",
  },
  {
    icon: "Layers",
    title: "All Skill Levels",
    description:
      "From beginner-friendly builds to advanced joinery projects \u2014 there\u2019s a plan for you.",
  },
  {
    icon: "Download",
    title: "Instant Download",
    description:
      "All plans are completely free. Just enter your name and email to download instantly.",
  },
];

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const hero = await client.fetch<HeroSectionType | null>(HERO_SECTION_QUERY);
    return {
      title:
        hero?.seoTitle ?? "Woodgrain & Sawdust | Woodworking Cut Plans",
      description:
        hero?.seoDescription ??
        "Detailed PDF cut plans for woodworking projects of all skill levels. All plans are free — download instantly.",
    };
  } catch (error) {
    console.error("Failed to fetch SEO metadata from Sanity:", error);
    return {
      title: "Woodgrain & Sawdust | Woodworking Cut Plans",
      description:
        "Detailed PDF cut plans for woodworking projects of all skill levels. All plans are free — download instantly.",
    };
  }
}

const HomePage = async () => {
  const [featuredPlans, aboutSection, hero, featuresSection, featuredPlansConfig] =
    await Promise.all([
      client.fetch<CutPlanCardType[]>(FEATURED_CUT_PLANS_QUERY),
      client.fetch<AboutSectionType | null>(ABOUT_SECTION_QUERY),
      client.fetch<HeroSectionType | null>(HERO_SECTION_QUERY),
      client.fetch<FeaturesSectionType | null>(FEATURES_SECTION_QUERY),
      client.fetch<FeaturedPlansSectionType | null>(
        FEATURED_PLANS_SECTION_QUERY
      ),
    ]);

  const sortedFeaturedPlans = featuredPlans
    ? [...featuredPlans.filter((p) => !p.comingSoon), ...featuredPlans.filter((p) => p.comingSoon)]
    : [];
  const hasFeaturedPlans = sortedFeaturedPlans.length > 0;
  const features = featuresSection?.features ?? DEFAULT_FEATURES;

  return (
    <div className="flex flex-col">
      {/* Split Intro Section */}
      <section className="border-b border-cream-dark bg-cream">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row">
            {/* Left: Decorative brand panel */}
            <div className="flex items-center justify-center bg-walnut-dark px-12 py-16 lg:w-2/5 lg:min-h-[520px]">
              <div className="flex flex-col items-center text-center">
                <p className="font-heading text-4xl font-bold text-cream lg:text-5xl">
                  {hero?.brandNameLine1 ?? "Woodgrain"}
                  <br />
                  <span className="text-amber">
                    {hero?.brandNameConnector ?? "&"}
                  </span>{" "}
                  {hero?.brandNameLine2 ?? "Sawdust"}
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-cream/50">
                  {hero?.establishedText ?? "Est. 2024"}
                </p>
              </div>
            </div>

            {/* Right: Text content */}
            <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-16 lg:px-16 lg:py-20">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-amber" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
                  {hero?.brandLabel ?? "Woodgrain & Sawdust"}
                </span>
              </div>

              <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-walnut lg:text-6xl">
                {hero?.heading ?? "Build It Yourself"}
                {(hero?.headingAccent ?? true) && (
                  <>
                    <br />
                    <span className="text-amber-light">
                      {hero?.headingAccent ?? "with Our Cut Plans."}
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-md text-lg leading-relaxed text-charcoal-light">
                {hero?.subheading ??
                  "Detailed PDF cut plans for woodworking projects of all skill levels. All plans are free — download instantly."}
              </p>

              <Button
                size="lg"
                className="w-fit rounded-full bg-amber px-8 py-6 text-base text-cream hover:bg-amber-light"
                asChild
              >
                <Link href={hero?.ctaLink === "/products" ? "/plans" : (hero?.ctaLink ?? "/plans")}>
                  {hero?.ctaLink === "/products" ? "Browse Plans" : (hero?.ctaText ?? "Browse Plans")}
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
            {features.map((feature, index) => {
              const IconComponent = ICON_MAP[feature.icon] ?? FileText;
              return (
                <div
                  key={index}
                  className="flex flex-1 items-start gap-4 px-4 py-6 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0"
                >
                  <IconComponent className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                  <div>
                    <h3 className="mb-1 font-semibold text-cream">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-cream/60">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Plans Section */}
      <section className="bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-walnut">
              {featuredPlansConfig?.heading ?? "Featured Plans"}
            </h2>
            <Button
              variant="link"
              asChild
              className="text-amber hover:text-amber-light"
            >
              <Link href={featuredPlansConfig?.viewAllLink ?? "/plans"}>
                {featuredPlansConfig?.viewAllText ?? "View All"}
              </Link>
            </Button>
          </div>

          {hasFeaturedPlans ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedFeaturedPlans.map((plan) => (
                <CutPlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <ImageIcon className="mx-auto mb-4 h-10 w-10 text-walnut/20" />
              <p className="mb-1 font-semibold text-walnut">
                {featuredPlansConfig?.emptyStateHeading ??
                  "No featured plans available right now"}
              </p>
              <p className="mb-4 text-sm text-charcoal-light">
                {featuredPlansConfig?.emptyStateText ??
                  "Check back soon for new woodworking cut plans."}
              </p>
              <Button
                className="rounded-full bg-amber px-6 text-cream hover:bg-amber-light"
                asChild
              >
                <Link href="/plans">Browse All Plans</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      {aboutSection && <AboutSection data={aboutSection} />}
    </div>
  );
};

export default HomePage;
