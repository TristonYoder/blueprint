import type { Win } from "@/types/blueprint";
import { BadgeCheck, ArrowUpRight } from "lucide-react";
import Meter from "./visuals/Meter";
import Sparkline from "./visuals/Sparkline";

interface WinCardProps {
  win: Win;
}

// A deliberate positive signal, not a redline — green accent, never
// actionable (there's nothing to resolve), same card shell and instrument
// grammar as RedlineCard so it reads as part of the same system rather
// than a different widget bolted on.
export default function WinCard({ win }: WinCardProps) {
  return (
    <div className="border-l-2 border-bp-stamp bg-bp-surface p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BadgeCheck size={16} className="text-bp-stamp shrink-0" />
          <span className="text-bp-ink font-medium">{win.title}</span>
        </div>

        <div className="text-bp-ink-dim text-sm">{win.detail}</div>

        {win.visual?.kind === "meter" && (
          <Meter
            unit={win.visual.unit}
            spent={win.visual.spent}
            limit={win.visual.limit}
            tone="positive"
          />
        )}
        {win.visual?.kind === "trend" && (
          <Sparkline
            unit={win.visual.unit}
            points={win.visual.points}
            baseline={win.visual.baseline}
            flagFromIndex={win.visual.flagFromIndex}
            tone="positive"
          />
        )}

        {win.sourceHref && (
          <a
            href={win.sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bp-label text-bp-ink-dim hover:opacity-75 transition-opacity"
          >
            <ArrowUpRight size={16} />
            See: {win.source}
          </a>
        )}
      </div>
    </div>
  );
}
