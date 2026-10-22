/**
 * Visitor numbers from Cloudflare Web Analytics (the beacon on both sites), read through
 * Cloudflare's GraphQL API for the admin dashboard.
 *
 * Needs two server-only env vars (Netlify → main site → Environment variables):
 *   CLOUDFLARE_ACCOUNT_ID         — Cloudflare dashboard → Account home → Account ID
 *   CLOUDFLARE_ANALYTICS_API_TOKEN — My Profile → API Tokens → Create token → Custom,
 *                                    permission "Account · Account Analytics · Read"
 */

const ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";

/** Our sites. Filtering by host keeps other sites on the same Cloudflare account out. */
export const SITE_HOSTS = [
  "woodgrainandsawdust.com",
  "www.woodgrainandsawdust.com",
  "designer.woodgrainandsawdust.com",
];

export type Totals = { visits: number; pageViews: number };
export type Ranked = { label: string; visits: number; pageViews: number };
export type Day = { date: string; visits: number; pageViews: number };

export type VisitorStats = {
  last24h: Totals | null;
  last7d: Totals | null;
  last30d: Totals | null;
  /** Last 7 days. */
  sources: Ranked[];
  pages: Ranked[];
  sites: Ranked[];
  /** Last 30 days, oldest first. */
  days: Day[];
};

export type VisitorResult =
  | { status: "unconfigured" }
  | { status: "error"; message: string }
  | { status: "ok"; stats: VisitorStats };

type Group = { count: number; sum: { visits: number }; dimensions?: Record<string, string> };

export function isConfigured(): boolean {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_ANALYTICS_API_TOKEN);
}

async function query(gql: string, variables: Record<string, unknown>): Promise<Record<string, Group[]>> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_ANALYTICS_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gql,
      variables: { accountTag: process.env.CLOUDFLARE_ACCOUNT_ID, hosts: SITE_HOSTS, ...variables },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Cloudflare answered ${res.status}`);
  const json = (await res.json()) as {
    data?: { viewer?: { accounts?: Record<string, Group[]>[] } };
    errors?: { message: string }[] | null;
  };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  const account = json.data?.viewer?.accounts?.[0];
  if (!account) throw new Error("Cloudflare account not found — check CLOUDFLARE_ACCOUNT_ID");
  return account;
}

const totalsQuery = `
query ($accountTag: string!, $hosts: [string!], $since: Time!) {
  viewer { accounts(filter: { accountTag: $accountTag }) {
    totals: rumPageloadEventsAdaptiveGroups(limit: 1, filter: { datetime_geq: $since, requestHost_in: $hosts }) {
      count sum { visits }
    }
  } }
}`;

const breakdownQuery = `
query ($accountTag: string!, $hosts: [string!], $since: Time!) {
  viewer { accounts(filter: { accountTag: $accountTag }) {
    sources: rumPageloadEventsAdaptiveGroups(limit: 20, filter: { datetime_geq: $since, requestHost_in: $hosts }, orderBy: [sum_visits_DESC]) {
      count sum { visits } dimensions { refererHost }
    }
    pages: rumPageloadEventsAdaptiveGroups(limit: 10, filter: { datetime_geq: $since, requestHost_in: $hosts }, orderBy: [count_DESC]) {
      count sum { visits } dimensions { requestHost requestPath }
    }
    sites: rumPageloadEventsAdaptiveGroups(limit: 5, filter: { datetime_geq: $since, requestHost_in: $hosts }, orderBy: [sum_visits_DESC]) {
      count sum { visits } dimensions { requestHost }
    }
  } }
}`;

const daysQuery = `
query ($accountTag: string!, $hosts: [string!], $since: Time!) {
  viewer { accounts(filter: { accountTag: $accountTag }) {
    days: rumPageloadEventsAdaptiveGroups(limit: 40, filter: { datetime_geq: $since, requestHost_in: $hosts }, orderBy: [date_ASC]) {
      count sum { visits } dimensions { date }
    }
  } }
}`;

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

function toTotals(groups: Group[] | undefined): Totals {
  const g = groups?.[0];
  return { visits: g?.sum.visits ?? 0, pageViews: g?.count ?? 0 };
}

/** "designer.woodgrainandsawdust.com" → "Designer", the rest → "Main site". */
export function siteName(host: string): string {
  return host.startsWith("designer.") ? "Designer" : "Main site";
}

/** Where a visit came from. Visits with no referrer (typed URL, bookmarks, most in-app browsers like TikTok's) are "Direct". */
export function sourceLabel(refererHost: string): string {
  const host = refererHost.replace(/^www\./, "").replace(/^m\./, "");
  return host || "Direct / app";
}

/** Add up rows with the same label, biggest first. */
export function mergeByLabel(rows: Ranked[]): Ranked[] {
  const byLabel = new Map<string, Ranked>();
  for (const r of rows) {
    const row = byLabel.get(r.label) ?? { label: r.label, visits: 0, pageViews: 0 };
    row.visits += r.visits;
    row.pageViews += r.pageViews;
    byLabel.set(r.label, row);
  }
  return [...byLabel.values()].sort((a, b) => b.visits - a.visits);
}

/** Merge rows that share a label (e.g. www.tiktok.com + m.tiktok.com), dropping our own sites (clicks between pages). */
export function rankSources(groups: Group[]): Ranked[] {
  const rows = groups
    .filter((g) => !SITE_HOSTS.includes(g.dimensions?.refererHost ?? ""))
    .map((g) => ({ label: sourceLabel(g.dimensions?.refererHost ?? ""), visits: g.sum.visits, pageViews: g.count }));
  return mergeByLabel(rows).filter((r) => r.visits > 0).slice(0, 8);
}

export async function getVisitorStats(): Promise<VisitorResult> {
  if (!isConfigured()) return { status: "unconfigured" };

  const [d1, d7, d30, breakdown, days] = await Promise.allSettled([
    query(totalsQuery, { since: hoursAgo(24) }),
    query(totalsQuery, { since: hoursAgo(24 * 7) }),
    query(totalsQuery, { since: hoursAgo(24 * 30) }),
    query(breakdownQuery, { since: hoursAgo(24 * 7) }),
    query(daysQuery, { since: hoursAgo(24 * 30) }),
  ]);

  const all = [d1, d7, d30, breakdown, days];
  if (all.every((r) => r.status === "rejected")) {
    const reason = (d1 as PromiseRejectedResult).reason;
    return { status: "error", message: reason instanceof Error ? reason.message : String(reason) };
  }

  const ok = <T,>(r: PromiseSettledResult<T>) => (r.status === "fulfilled" ? r.value : undefined);
  const b = ok(breakdown);

  return {
    status: "ok",
    stats: {
      last24h: d1.status === "fulfilled" ? toTotals(d1.value.totals) : null,
      last7d: d7.status === "fulfilled" ? toTotals(d7.value.totals) : null,
      last30d: d30.status === "fulfilled" ? toTotals(d30.value.totals) : null,
      sources: rankSources(b?.sources ?? []),
      pages: (b?.pages ?? []).map((g) => ({
        label: `${siteName(g.dimensions?.requestHost ?? "")} ${g.dimensions?.requestPath ?? ""}`,
        visits: g.sum.visits,
        pageViews: g.count,
      })),
      sites: mergeByLabel(
        (b?.sites ?? []).map((g) => ({
          label: siteName(g.dimensions?.requestHost ?? ""),
          visits: g.sum.visits,
          pageViews: g.count,
        })),
      ),
      days: (ok(days)?.days ?? []).map((g) => ({
        date: g.dimensions?.date ?? "",
        visits: g.sum.visits,
        pageViews: g.count,
      })),
    },
  };
}
