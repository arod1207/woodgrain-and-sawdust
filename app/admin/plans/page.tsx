import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/src/sanity/lib/client";
import { CUT_PLANS_QUERY } from "@/src/sanity/lib/queries";
import type { CutPlanCard } from "@/src/sanity/lib/types";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, ExternalLink, Pencil, AlertTriangle } from "lucide-react";

export const revalidate = 60;

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "border-sage/30 bg-sage/10 text-sage",
  intermediate: "border-amber/30 bg-amber/10 text-amber",
  advanced: "border-red-200 bg-red-50 text-red-500",
};

const PlansPage = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  if (role !== "admin") redirect("/sign-in");

  let plansError = false;
  const plans = await client
    .fetch<CutPlanCard[]>(CUT_PLANS_QUERY)
    .catch(() => {
      plansError = true;
      return [];
    });

  return (
    <div>
      {/* Error banner */}
      {plansError && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Failed to load plans. Check your Sanity connection.
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-walnut sm:text-3xl">Cut Plans</h1>
          <p className="mt-2 text-charcoal-light">
            {plans.length} {plans.length === 1 ? "plan" : "plans"} in Sanity
          </p>
        </div>
        <Button
          className="rounded-full bg-amber text-white hover:bg-amber-light"
          asChild
        >
          <Link href="/studio">
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Link>
        </Button>
      </div>

      {/* Plans List */}
      <Card className="border-cream-dark">
        <CardContent className="p-0">
          {!plansError && plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-charcoal-light">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-medium text-charcoal">No plans yet</h3>
              <CardDescription className="mb-6">
                Add your first cut plan in Sanity Studio.
              </CardDescription>
              <Button
                className="rounded-full bg-amber text-white hover:bg-amber-light"
                asChild
              >
                <Link href="/studio">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Sanity Studio
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-cream-dark">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="flex items-center gap-4 p-4 sm:p-5"
                >
                  {/* Thumbnail */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                    {plan.image?.asset?.url ? (
                      <Image
                        src={plan.image.asset.url}
                        alt={plan.image.alt ?? plan.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-charcoal-light">
                        <FileText className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-charcoal">
                        {plan.name}
                      </p>
                      {plan.featured && (
                        <Badge
                          variant="outline"
                          className="border-amber/30 bg-amber/10 text-amber text-[10px]"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-charcoal-light">
                      {plan.difficulty && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] capitalize ${DIFFICULTY_STYLES[plan.difficulty] ?? ""}`}
                        >
                          {plan.difficulty}
                        </Badge>
                      )}
                      {plan.category?.name && (
                        <span>{plan.category.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Edit */}
                  <div className="flex shrink-0 items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 text-charcoal-light hover:bg-amber/10 hover:text-amber"
                      asChild
                      title="Edit in Sanity Studio"
                    >
                      <Link
                        href={`/studio/structure/cutPlan;${plan._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit {plan.name}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-charcoal-light">
        Manage plans, images, and descriptions in{" "}
        <Link href="/studio" className="text-amber hover:underline">
          Sanity Studio
        </Link>
        .
      </p>
    </div>
  );
};

export default PlansPage;
