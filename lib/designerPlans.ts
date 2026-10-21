/**
 * The plans on this site: each one opens in the Designer (keep in step with the
 * Designer's src/templates). Plans not listed here stay in Sanity but aren't shown.
 */
export const DESIGNER_PLANS = [
  "cedar-picket-planter",
  "24-x-24-raised-planter",
  "raised-cedar-planter-box",
  "cedar-string-light-planter",
  "cedar-bench-planter",
  "mobile-saw-station-workbench",
  "woven-cross",
  "bluebird-house",
] as const;

/** Designer starter projects that need Designer Pro (the rest are free for everyone). */
export const PRO_PLANS = new Set<string>(["bluebird-house"]);

export const DESIGNER_URL = "https://designer.woodgrainandsawdust.com";

/** Opens the plan in the Designer, ready to edit. */
export const designerPlanUrl = (slug: string) => `${DESIGNER_URL}/new?template=${slug}`;

/** GROQ filter limiting cut plans to the Designer's. */
export const DESIGNER_PLANS_FILTER = `slug.current in ${JSON.stringify(DESIGNER_PLANS)}`;
