import type { MetadataRoute } from "next";
import { client } from "@/src/sanity/lib/client";
import { CUT_PLAN_SLUGS_QUERY } from "@/src/sanity/lib/queries";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://woodgrainandsawdust.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await client.fetch<{ slug: string }[]>(CUT_PLAN_SLUGS_QUERY);

  const planUrls: MetadataRoute.Sitemap = slugs.map(({ slug }) => ({
    url: `${BASE_URL}/plans/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/plans`, changeFrequency: "weekly", priority: 0.9 },
    ...planUrls,
  ];
}
