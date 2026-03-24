import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/src/sanity/lib/client";
import { CUT_PLAN_QUERY, CUT_PLAN_SLUGS_QUERY } from "@/src/sanity/lib/queries";
import type { CutPlan } from "@/src/sanity/lib/types";
import ProductGallery from "@/components/customer/ProductGallery";
import PlanActions from "@/components/customer/PlanActions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Wrench, TreePine } from "lucide-react";

interface PlanPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export const generateStaticParams = async () => {
  const slugs = await client.fetch<{ slug: string }[]>(CUT_PLAN_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
};

export const generateMetadata = async ({ params }: PlanPageProps) => {
  const { slug } = await params;
  const plan = await client.fetch<CutPlan>(CUT_PLAN_QUERY, { slug });

  if (!plan) {
    return { title: "Plan Not Found" };
  }

  return {
    title: `${plan.name} | Woodgrain & Sawdust`,
    description: plan.description,
  };
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "border-sage/30 bg-sage/10 text-sage",
  intermediate: "border-amber/30 bg-amber/10 text-amber",
  advanced: "border-red-200 bg-red-50 text-red-500",
};

const PlanPage = async ({ params }: PlanPageProps) => {
  const { slug } = await params;
  const plan = await client.fetch<CutPlan>(CUT_PLAN_QUERY, { slug });

  if (!plan) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(plan.price);

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
              href="/plans"
              className="text-charcoal-light transition-colors hover:text-amber"
            >
              Plans
            </Link>
          </li>
          <li className="text-charcoal-light">/</li>
          <li className="font-medium text-walnut">{plan.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          <ProductGallery images={plan.images} productName={plan.name} />
        </div>

        {/* Plan Info */}
        <div className="flex flex-col lg:w-1/2">
          {/* Category */}
          {plan.category && (
            <Link
              href={`/plans?category=${plan.category.slug}`}
              className="mb-2 text-sm font-medium text-amber transition-colors hover:text-amber-light"
            >
              {plan.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold text-walnut sm:text-4xl">
            {plan.name}
          </h1>

          {/* PlanActions handles price, children (details), and buy/download buttons */}
          <PlanActions
            planId={plan._id}
            price={plan.price}
            formattedPrice={formattedPrice}
          >
            {/* Difficulty badge */}
            <div className="mb-6">
              <Badge
                variant="outline"
                className={`text-xs capitalize ${DIFFICULTY_STYLES[plan.difficulty] ?? ""}`}
              >
                {plan.difficulty}
              </Badge>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-2 text-lg font-semibold text-walnut">
                About This Plan
              </h2>
              <p className="whitespace-pre-line text-charcoal-light">
                {plan.description}
              </p>
            </div>

            {/* Plan Details Card */}
            <Card className="mb-8 border-cream-dark bg-cream">
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-walnut">
                  Plan Details
                </h2>
                <dl className="space-y-4">
                  {plan.estimatedTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                      <div>
                        <dt className="text-sm font-medium text-charcoal-light">
                          Estimated Build Time
                        </dt>
                        <dd className="text-charcoal">{plan.estimatedTime}</dd>
                      </div>
                    </div>
                  )}

                  {plan.toolsRequired && plan.toolsRequired.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                      <div>
                        <dt className="text-sm font-medium text-charcoal-light">
                          Tools Required
                        </dt>
                        <dd className="text-charcoal">
                          <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">
                            {plan.toolsRequired.map((tool) => (
                              <li key={tool}>{tool}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </div>
                  )}

                  {plan.materialsRequired &&
                    plan.materialsRequired.length > 0 && (
                      <div className="flex items-start gap-3">
                        <TreePine className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                        <div>
                          <dt className="text-sm font-medium text-charcoal-light">
                            Materials Required
                          </dt>
                          <dd className="text-charcoal">
                            <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">
                              {plan.materialsRequired.map((material) => (
                                <li key={material}>{material}</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      </div>
                    )}
                </dl>
              </CardContent>
            </Card>
          </PlanActions>
        </div>
      </div>

      {/* TikTok Build Video */}
      {plan.tiktokUrl && (
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
                See This Project Come to Life
              </h2>
              <p className="text-cream/70">
                Follow along on TikTok as this{" "}
                {plan.name.toLowerCase()} is built from start to finish.
              </p>
            </div>
            <a
              href={plan.tiktokUrl}
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

export default PlanPage;
