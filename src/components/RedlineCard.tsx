import type { Redline } from "@/types/blueprint";
import { Stamp, Check, ArrowUpRight, AlertTriangle } from "lucide-react";
import Meter from "./visuals/Meter";
import Sparkline from "./visuals/Sparkline";
import CardComments from "./CardComments";

interface RedlineCardProps {
  redline: Redline;
  onResolve?: (id: string) => void;
  resolving?: boolean;
}

export default function RedlineCard({
  redline,
  onResolve,
  resolving = false,
}: RedlineCardProps) {
  const isAction = redline.kind === "action";
  const isReference = redline.kind === "reference";
  const isSyncError = redline.kind === "sync-error";

  // Determine border and background classes based on kind
  const borderClass =
    isSyncError
      ? "border-l-2 border-dashed border-bp-redline-border"
      : "border-l-2 border-bp-redline";

  const bgClass = isSyncError ? "bg-bp-redline-dim" : "bg-bp-surface";

  const containerClass = `${borderClass} ${bgClass} p-4 transition-opacity duration-300 ${
    resolving ? "opacity-60 pointer-events-none" : ""
  }`;

  return (
    <div className={containerClass}>
      <div className="flex flex-col gap-3">
        {/* Title */}
        <div className="text-bp-ink font-medium">{redline.title}</div>

        {/* Detail */}
        <div className="text-bp-ink-dim text-sm">{redline.detail}</div>

        {/* The instrument readout — shows the number instead of just naming it */}
        {redline.visual?.kind === "meter" && (
          <Meter
            unit={redline.visual.unit}
            spent={redline.visual.spent}
            limit={redline.visual.limit}
          />
        )}
        {redline.visual?.kind === "trend" && (
          <Sparkline
            unit={redline.visual.unit}
            points={redline.visual.points}
            baseline={redline.visual.baseline}
            flagFromIndex={redline.visual.flagFromIndex}
          />
        )}

        {/* Footer: kind-specific action/reference/error indicator */}
        <div>
          {isAction && (
            <button
              onClick={() => onResolve?.(redline.id)}
              disabled={resolving}
              className="inline-flex items-center gap-2 bp-label text-bp-redline hover:opacity-75 transition-opacity disabled:cursor-not-allowed"
              type="button"
            >
              {resolving ? (
                <>
                  <Check size={16} />
                  RESOLVED
                </>
              ) : (
                <>
                  <Stamp size={16} />
                  {redline.actionLabel}
                </>
              )}
            </button>
          )}

          {isReference && (
            <a
              href={redline.sourceHref ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bp-label text-bp-ink-dim hover:opacity-75 transition-opacity"
            >
              <ArrowUpRight size={16} />
              See: {redline.source}
            </a>
          )}

          {isSyncError && (
            <div className="inline-flex items-center gap-2 bp-label text-bp-redline">
              <AlertTriangle size={16} />
              {redline.source} unavailable
            </div>
          )}
        </div>

        <CardComments cardKind="redline" cardId={redline.id} comments={redline.comments ?? []} />
      </div>
    </div>
  );
}
