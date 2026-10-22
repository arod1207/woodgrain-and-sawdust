import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, AlertTriangle } from "lucide-react";
import { getVisitorStats, type Ranked, type Totals, type Day } from "@/lib/cloudflareAnalytics";

const fmt = (n: number) => n.toLocaleString("en-US");

function Stat({ label, totals }: { label: string; totals: Totals | null }) {
  return (
    <div className="flex-1 rounded-lg bg-cream-dark/40 p-4">
      <p className="text-sm font-medium text-charcoal-light">{label}</p>
      <p className="mt-1 text-2xl font-bold text-walnut">{totals ? fmt(totals.visits) : "—"}</p>
      <p className="text-xs text-charcoal-light">
        visits{totals ? ` · ${fmt(totals.pageViews)} page views` : ""}
      </p>
    </div>
  );
}

function RankedList({ title, rows, empty }: { title: string; rows: Ranked[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.visits || r.pageViews));
  return (
    <div className="min-w-0 flex-1">
      <h3 className="mb-3 text-sm font-semibold text-walnut">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-charcoal-light">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => {
            const value = r.visits || r.pageViews;
            return (
              <li key={r.label} className="relative overflow-hidden rounded-md px-2 py-1.5 text-sm">
                <span
                  className="absolute inset-y-0 left-0 bg-amber/15"
                  style={{ width: `${(value / max) * 100}%` }}
                  aria-hidden
                />
                <span className="relative flex justify-between gap-3">
                  <span className="truncate text-charcoal">{r.label}</span>
                  <span className="shrink-0 font-medium text-charcoal-light">{fmt(value)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DayBars({ days }: { days: Day[] }) {
  if (days.length === 0) return null;
  const max = Math.max(1, ...days.map((d) => d.visits));
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-semibold text-walnut">Visits per day (last 30 days)</h3>
      <div className="flex h-28 items-end gap-1">
        {days.map((d) => {
          const label = new Date(`${d.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          return (
            <div
              key={d.date}
              className="flex-1 rounded-t-sm bg-amber/70 hover:bg-amber"
              style={{ height: `${Math.max(2, (d.visits / max) * 100)}%` }}
              title={`${label}: ${fmt(d.visits)} visits, ${fmt(d.pageViews)} page views`}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-charcoal-light">
        <span>{new Date(`${days[0].date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

/** Visitors to both sites (main + Designer), from Cloudflare Web Analytics. */
export default async function VisitorsCard() {
  const result = await getVisitorStats();

  return (
    <Card className="mb-8 border-cream-dark">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-amber" />
          <CardTitle className="text-walnut">Visitors</CardTitle>
        </div>
        <CardDescription>
          Main site and Designer, from Cloudflare Web Analytics. Ad blockers and some in-app browsers
          hide visits, so real numbers run a little higher.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result.status === "unconfigured" && (
          <div className="rounded-lg bg-cream-dark/40 p-4 text-sm text-charcoal">
            <p className="font-medium">Not connected yet.</p>
            <p className="mt-1 text-charcoal-light">
              In Netlify (this site → Environment variables) add <code>CLOUDFLARE_ACCOUNT_ID</code> and{" "}
              <code>CLOUDFLARE_ANALYTICS_API_TOKEN</code> (a Cloudflare API token with &ldquo;Account Analytics:
              Read&rdquo;), then redeploy.
            </p>
          </div>
        )}

        {result.status === "error" && (
          <div className="flex items-start gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Visitor numbers couldn&rsquo;t load from Cloudflare ({result.message}). Check the account ID and that the
              API token has &ldquo;Account Analytics: Read&rdquo;.
            </span>
          </div>
        )}

        {result.status === "ok" && (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <Stat label="Last 24 hours" totals={result.stats.last24h} />
              <Stat label="Last 7 days" totals={result.stats.last7d} />
              <Stat label="Last 30 days" totals={result.stats.last30d} />
            </div>

            <DayBars days={result.stats.days} />

            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-charcoal-light">Last 7 days</p>
            <div className="flex flex-col gap-6 lg:flex-row">
              <RankedList title="Where visitors came from" rows={result.stats.sources} empty="No visits yet." />
              <RankedList title="Top pages (page views)" rows={result.stats.pages.map((p) => ({ ...p, visits: 0 }))} empty="No page views yet." />
              <RankedList title="By site" rows={result.stats.sites} empty="No visits yet." />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
