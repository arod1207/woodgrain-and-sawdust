import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/src/sanity/lib/image";
import { Badge } from "@/components/ui/badge";
import type { CutPlanCard as CutPlanCardType } from "@/src/sanity/lib/types";
import { ImageIcon } from "lucide-react";

interface Props {
  plan: CutPlanCardType;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "border-sage/30 bg-sage/10 text-sage",
  intermediate: "border-amber/30 bg-amber/10 text-amber",
  advanced: "border-red-200 bg-red-50 text-red-500",
};

export default function CutPlanCard({ plan }: Props) {
  const { name, slug, difficulty, image } = plan;

  return (
    <Link href={`/plans/${slug}`} className="group block focus:outline-none">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
        {image?.asset ? (
          <Image
            src={urlFor(image).width(600).auto("format").url()}
            alt={image.alt || name}
            width={600}
            height={600}
            className="h-full w-full object-scale-down transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={image.asset.metadata?.lqip}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-walnut/20">
            <ImageIcon className="h-16 w-16" />
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
    </Link>
  );
}
