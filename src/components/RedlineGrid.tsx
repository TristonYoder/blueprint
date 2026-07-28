import type { Redline } from "@/types/blueprint";
import RedlineCard from "./RedlineCard";
import CleanSheet from "./CleanSheet";
import NoPlanState from "./NoPlanState";

interface RedlineGridProps {
  domainLabel: string;
  hasGoals: boolean;
  active: Redline[];
  resolvingIds: Set<string>;
  onResolve: (id: string) => void;
  /** Overview's per-domain columns are already narrow — force a single column. */
  compact?: boolean;
}

export default function RedlineGrid({
  domainLabel,
  hasGoals,
  active,
  resolvingIds,
  onResolve,
  compact = false,
}: RedlineGridProps) {
  if (!hasGoals) {
    return <NoPlanState domainLabel={domainLabel} compact={compact} />;
  }

  if (active.length === 0) {
    return <CleanSheet domainLabel={domainLabel} compact={compact} />;
  }

  return (
    <div
      className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"}`}
    >
      {active.map((redline) => (
        <RedlineCard
          key={redline.id}
          redline={redline}
          resolving={resolvingIds.has(redline.id)}
          onResolve={onResolve}
        />
      ))}
    </div>
  );
}
