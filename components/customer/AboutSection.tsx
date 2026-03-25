import Image from "next/image";
import type { AboutSection as AboutSectionType } from "@/src/sanity/lib/types";

interface Props {
  data: AboutSectionType;
}

const AboutSection = ({ data }: Props) => {
  const { heading, subheading, body, image, stats } = data;

  const paragraphs = body.split("\n").filter((p) => p.trim().length > 0);

  return (
    <section className="texture-grain py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Image */}
          {image?.asset && (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl lg:w-[45%] lg:shrink-0">
              <Image
                src={image.asset.url}
                alt={image.alt ?? heading}
                fill
                className="object-cover"
                placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={image.asset.metadata?.lqip}
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col gap-6">
            {subheading && (
              <p className="font-heading text-sm font-semibold uppercase tracking-widest text-amber">
                {subheading}
              </p>
            )}
            <h2 className="text-3xl font-bold text-walnut sm:text-4xl">
              {heading}
            </h2>
            <div className="flex flex-col gap-4">
              {paragraphs.map((paragraph, i) => (
                <p key={i} className="text-charcoal-light leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-8 border-t border-cream-dark pt-6">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-3xl font-bold text-amber">
                      {stat.value}
                    </span>
                    <span className="text-sm text-charcoal-light">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
