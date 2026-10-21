import { Sparkles } from "lucide-react";

/** The Designer's "Pro" pill (same look as in the Designer), for plans that need Designer Pro. */
export default function ProBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber ${className}`}
      title="Needs Designer Pro — try it free for 7 days"
    >
      <Sparkles className="size-3" aria-hidden /> Pro
    </span>
  );
}
