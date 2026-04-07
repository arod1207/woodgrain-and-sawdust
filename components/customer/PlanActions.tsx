"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import DownloadForm from "@/components/customer/DownloadForm";
import { Download, Beer, Link2, Check, Mail, Share2 } from "lucide-react";
import type { ReactNode } from "react";

interface PlanActionsProps {
  planId: string;
  planName: string;
  planSlug: string;
  shareUrl: string;
  ogImageUrl?: string;
  comingSoon?: boolean;
  children: ReactNode;
}

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/woodgrainandsawdust";

interface PinterestIconProps {
  className?: string;
}

// Pinterest SVG icon (no lucide equivalent)
function PinterestIcon({ className }: PinterestIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

export default function PlanActions({
  planId,
  planName,
  planSlug,
  shareUrl,
  ogImageUrl,
  comingSoon,
  children,
}: PlanActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const recordEvent = useMutation(api.events.recordEvent);

  useEffect(() => { setMounted(true); }, []);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPinterestUrl = () => {
    const pageUrl = encodeURIComponent(shareUrl);
    const description = encodeURIComponent(`Free woodworking cut plan: ${planName} — download it free at Woodgrain & Sawdust!`);
    const media = ogImageUrl ? `&media=${encodeURIComponent(ogImageUrl)}` : "";
    return `https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${description}${media}`;
  };

  const getEmailUrl = () => {
    const subject = encodeURIComponent(`Check out this free woodworking plan: ${planName}`);
    const body = encodeURIComponent(`Hey! I found this free cut plan for a ${planName} — thought you might like it.\n\n${shareUrl}`);
    return `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Plan label */}
      <div className="mb-6">
        {comingSoon ? (
          <span className="inline-block rounded-full bg-walnut/10 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-walnut">
            Coming Soon
          </span>
        ) : (
          <p className="text-3xl font-bold text-amber">Free</p>
        )}
      </div>

      {children}

      {/* Action buttons */}
      <div className="space-y-3">
        {comingSoon ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-walnut/20 bg-walnut/5 px-8 py-4 text-base font-semibold text-walnut/50">
            Download Coming Soon
          </div>
        ) : (
          <>
            <Button
              size="lg"
              className="w-full rounded-full bg-amber px-8 py-6 text-base text-white hover:bg-amber-light"
              onClick={() => {
                setDialogOpen(true);
                recordEvent({ event: "form_open", planId, planName }).catch(() => {});
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Plan
            </Button>

            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-amber/30 px-6 py-3 text-sm font-medium text-amber transition-colors hover:border-amber hover:bg-amber/5"
            >
              <Beer className="h-4 w-4" />
              Enjoy this plan? Buy me a beer!
            </a>

            {/* Share row — client-only, window/navigator not safe on server */}
            {mounted && <div className="pt-2">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-charcoal-light">
                <Share2 className="h-3.5 w-3.5" />
                Share this plan
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-cream-dark bg-cream px-3 py-2 text-xs font-medium text-charcoal transition-colors hover:border-amber hover:text-amber"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-sage" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy link"}
                </button>

                <button
                  onClick={() => window.open(getPinterestUrl(), "_blank", "noopener,noreferrer")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-cream-dark bg-cream px-3 py-2 text-xs font-medium text-charcoal transition-colors hover:border-walnut hover:text-walnut"
                >
                  <PinterestIcon className="h-3.5 w-3.5" />
                  Pinterest
                </button>

                <button
                  onClick={() => { window.location.href = getEmailUrl(); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-cream-dark bg-cream px-3 py-2 text-xs font-medium text-charcoal transition-colors hover:border-amber hover:text-amber"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </button>
              </div>
            </div>}
          </>
        )}
      </div>

      {!comingSoon && (
        <DownloadForm
          planId={planId}
          planName={planName}
          planSlug={planSlug}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
