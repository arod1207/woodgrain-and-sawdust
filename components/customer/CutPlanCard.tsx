import Image from "next/image";
import { urlFor } from "@/src/sanity/lib/image";
import { Badge } from "@/components/ui/badge";
import type { CutPlanCard as CutPlanCardType } from "@/src/sanity/lib/types";
import { ImageIcon } from "lucide-react";
import { designerPlanUrl, PRO_PLANS } from "@/lib/designerPlans";
import ProBadge from "@/components/customer/ProBadge";

interface Props {
  plan: CutPlanCardType;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "border-sage/30 bg-sage/10 text-sage",
  intermediate: "border-amber/30 bg-amber/10 text-amber",
  advanced: "border-red-200 bg-red-50 text-red-500",
};

export default function CutPlanCard({ plan }: Props) {
  const { name, slug, difficulty, image, comingSoon } = plan;

  return (
    // Every plan opens straight in the Designer, ready to edit (its /plans page stays for search and shares).
    <a href={designerPlanUrl(slug)} className="group block focus:outline-none">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
        {image?.asset ? (
          <Image
            src={urlFor(image).width(600).auto("format").url()}
            alt={image.alt || name}
            width={600}
            height={600}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${comingSoon ? "brightness-75" : ""}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={image.asset.metadata?.lqip}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-walnut/20">
            <ImageIcon className="h-16 w-16" />
          </div>
        )}
        {PRO_PLANS.has(slug) && <ProBadge className="absolute left-3 top-3 bg-white shadow-sm" />}
        {comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-walnut/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cream">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="truncate text-base font-semibold text-walnut transition-colors group-hover:text-amber">
          {name}
        </h3>
        {difficulty && (
          <Badge
            variant="outline"
            className={`mt-1 text-[10px] capitalize ${DIFFICULTY_STYLES[difficulty] ?? ""}`}
          >
            {difficulty}
          </Badge>
        )}
      </div>
    </a>
  );
}
