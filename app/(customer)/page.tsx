import Link from "next/link";
import { client } from "@/src/sanity/lib/client";
import {
  FEATURED_CUT_PLANS_QUERY,
  ABOUT_SECTION_QUERY,
  HERO_SECTION_QUERY,
} from "@/src/sanity/lib/queries";
import type {
  CutPlanCard as CutPlanCardType,
  AboutSection as AboutSectionType,
  HeroSection as HeroSectionType,
} from "@/src/sanity/lib/types";
import CutPlanCard from "@/components/customer/CutPlanCard";
import AboutSection from "@/components/customer/AboutSection";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  Layers,
  Download,
  ExternalLink,
  ImageIcon,
} from "lucide-react";

export const revalidate = 60;

const HomePage = async () => {
  const [featuredPlans, aboutSection, hero] = await Promise.all([
    client.fetch<CutPlanCardType[]>(FEATURED_CUT_PLANS_QUERY),
    client.fetch<AboutSectionType | null>(ABOUT_SECTION_QUERY),
    client.fetch<HeroSectionType | null>(HERO_SECTION_QUERY),
  ]);

  const hasFeaturedPlans = featuredPlans && featuredPlans.length > 0;

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
                    Woodworking Cut Plans
                  </p>
                </div>
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
                  "Detailed PDF cut plans for woodworking projects of all skill levels. Free and premium plans available for instant download."}
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
            <div className="flex flex-1 items-start gap-4 px-4 py-6 sm:px-8 sm:py-0 sm:first:pl-0">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <h3 className="mb-1 font-semibold text-cream">
                  Detailed Plans
                </h3>
                <p className="text-sm text-cream/60">
                  Step-by-step cut lists, dimensions, and assembly instructions
                  for every project.
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-4 px-4 py-6 sm:px-8 sm:py-0">
              <Layers className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <h3 className="mb-1 font-semibold text-cream">
                  All Skill Levels
                </h3>
                <p className="text-sm text-cream/60">
                  From beginner-friendly builds to advanced joinery projects —
                  there&apos;s a plan for you.
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-4 px-4 py-6 sm:px-8 sm:py-0 sm:last:pr-0">
              <Download className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <h3 className="mb-1 font-semibold text-cream">
                  Instant Download
                </h3>
                <p className="text-sm text-cream/60">
                  Purchase and download your plan immediately. Free plans
                  available too.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plans Section */}
      <section className="bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-walnut">Featured Plans</h2>
            <Button
              variant="link"
              asChild
              className="text-amber hover:text-amber-light"
            >
              <Link href="/plans">View All</Link>
            </Button>
          </div>

          {hasFeaturedPlans ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPlans.map((plan) => (
                <CutPlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <ImageIcon className="mx-auto mb-4 h-10 w-10 text-walnut/20" />
              <p className="mb-1 font-semibold text-walnut">
                No featured plans yet
              </p>
              <p className="mb-4 text-sm text-charcoal-light">
                Mark cut plans as &quot;Featured&quot; in Sanity Studio to
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
  );
};

export default HomePage;
