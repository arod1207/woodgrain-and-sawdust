import type { MetadataRoute } from "next";
import { client } from "@/src/sanity/lib/client";
import { CUT_PLAN_SLUGS_QUERY } from "@/src/sanity/lib/queries";
import { getSiteUrl } from "@/lib/siteUrl";

const BASE_URL = getSiteUrl();

const STATIC_URLS: MetadataRoute.Sitemap = [
  { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
  { url: `${BASE_URL}/plans`, changeFrequency: "weekly", priority: 0.9 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(CUT_PLAN_SLUGS_QUERY);

    const planUrls: MetadataRoute.Sitemap = slugs.map(({ slug }) => ({
      url: `${BASE_URL}/plans/${slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...STATIC_URLS, ...planUrls];
  } catch (err) {
    console.error("[sitemap] Failed to fetch plan slugs from Sanity:", err);
    return STATIC_URLS;
  }
}
