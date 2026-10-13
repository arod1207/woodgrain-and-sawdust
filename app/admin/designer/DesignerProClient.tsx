"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useConvexAuth, useMutation, useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Gift, Loader2, Search, Sparkles, UserX } from "lucide-react";

/**
 * The Designer keeps its accounts in its own Convex deployment. This page talks
 * to it directly with the same Clerk login; the Designer checks the admin role
 * itself (designer repo: convex/admin.ts).
 */
const designerUrl = process.env.NEXT_PUBLIC_DESIGNER_CONVEX_URL;
const designer = designerUrl ? new ConvexReactClient(designerUrl) : null;

interface Account {
  id: string;
  email: string | null;
  name: string | null;
  plan: "free" | "pro";
  subscribed: boolean;
  allowList: boolean;
  grant: { note: string; at: number; by: string } | null;
  joined: number;
}

const fn = {
  overview: makeFunctionReference<"query", Record<string, never>, { users: number; subscribed: number; granted: Account[] }>("admin:overview"),
  findByEmail: makeFunctionReference<"query", { email: string }, Account[]>("admin:findByEmail"),
  grantPro: makeFunctionReference<"mutation", { userId: string; note: string }, null>("admin:grantPro"),
  revokePro: makeFunctionReference<"mutation", { userId: string }, null>("admin:revokePro"),
};

const errorText = (err: unknown) => {
  const m = err instanceof Error ? /Uncaught Error: (.*?)(\n|$)/.exec(err.message) : null;
  return m ? m[1] : "That didn't work. Try again.";
};

export default function DesignerProClient() {
  if (!designer) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        NEXT_PUBLIC_DESIGNER_CONVEX_URL isn&apos;t set, so the Designer can&apos;t be reached.
      </div>
    );
  }
  return (
    <ConvexProviderWithClerk client={designer} useAuth={useAuth}>
      <DesignerPro />
    </ConvexProviderWithClerk>
  );
}

function DesignerPro() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const ready = !isLoading && isAuthenticated;
  const overview = useQuery(fn.overview, ready ? {} : "skip");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState("");
  const results = useQuery(fn.findByEmail, ready && searched ? { email: searched } : "skip");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-charcoal-light">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Connecting to the Designer…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-walnut sm:text-3xl">Designer Pro</h1>
        <p className="mt-2 text-charcoal-light">
          Give someone free Pro on the Designer, or take it back. Their projects are never touched.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Designer accounts", overview?.users],
          ["Paying / on trial", overview?.subscribed],
          ["Free Pro given", overview?.granted.length],
        ].map(([label, n]) => (
          <Card key={label as string} className="border-cream-dark">
            <CardHeader className="pb-2">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl text-walnut">{n ?? "…"}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mb-8 border-cream-dark">
        <CardHeader>
          <CardTitle className="text-walnut">Find an account</CardTitle>
          <CardDescription>The email they signed up to the Designer with.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(email.trim());
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="their email"
              aria-label="Email"
              className="h-10 flex-1 rounded-md border border-cream-dark bg-white px-3 text-sm"
            />
            <Button type="submit" className="gap-2 bg-amber text-white hover:bg-amber-light">
              <Search className="h-4 w-4" /> Find
            </Button>
          </form>
          {searched && results !== undefined && (
            <div className="mt-4">
              {results.length === 0 ? (
                <p className="text-sm text-charcoal-light">
                  No Designer account with that email. They need to sign up on the Designer (and sign in once) first.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {results.map((a) => (
                    <AccountRow key={a.id} account={a} />
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="mb-3 text-lg font-semibold text-walnut">Free Pro you&apos;ve given</h2>
      {overview && overview.granted.length === 0 && <p className="text-sm text-charcoal-light">Nobody yet.</p>}
      <ul className="flex flex-col gap-3">
        {overview?.granted.map((a) => (
          <AccountRow key={a.id} account={a} />
        ))}
      </ul>
    </div>
  );
}

function AccountRow({ account: a }: { account: Account }) {
  const grant = useMutation(fn.grantPro);
  const revoke = useMutation(fn.revokePro);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="rounded-lg border border-cream-dark bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-charcoal">{a.email ?? "(no email yet)"}</span>
        {a.name && <span className="text-sm text-charcoal-light">· {a.name}</span>}
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
            a.plan === "pro" ? "bg-amber/15 text-amber" : "bg-cream-dark text-charcoal-light"
          }`}
        >
          {a.plan}
        </span>
      </div>
      <p className="mt-1 text-xs text-charcoal-light">
        Joined {new Date(a.joined).toLocaleDateString()}
        {a.subscribed && " · paying or on trial"}
        {a.allowList && " · always Pro (owner list)"}
        {a.grant && ` · free Pro given ${new Date(a.grant.at).toLocaleDateString()}${a.grant.note ? ` — “${a.grant.note}”` : ""}`}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {a.grant ? (
          <Button variant="outline" size="sm" disabled={busy} onClick={() => run(() => revoke({ userId: a.id }))} className="gap-1.5">
            <UserX className="h-4 w-4" /> Remove free Pro
          </Button>
        ) : (
          <>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional), e.g. YouTube giveaway"
              aria-label="Note"
              className="h-9 min-w-48 flex-1 rounded-md border border-cream-dark px-2 text-sm"
            />
            <Button
              size="sm"
              disabled={busy}
              onClick={() => run(() => grant({ userId: a.id, note }))}
              className="gap-1.5 bg-amber text-white hover:bg-amber-light"
            >
              <Gift className="h-4 w-4" /> Give free Pro
            </Button>
          </>
        )}
        {a.plan === "pro" && !a.grant && (
          <span className="flex items-center gap-1 text-xs text-charcoal-light">
            <Sparkles className="h-3.5 w-3.5 text-amber" /> Already Pro
          </span>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </li>
  );
}
