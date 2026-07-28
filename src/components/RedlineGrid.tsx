import type { Redline, Win } from "@/types/blueprint";
import RedlineCard from "./RedlineCard";
import WinCard from "./WinCard";
import CleanSheet from "./CleanSheet";
import NoPlanState from "./NoPlanState";

interface RedlineGridProps {
  domainLabel: string;
  hasGoals: boolean;
  active: Redline[];
  wins?: Win[];
  resolvingIds: Set<string>;
  onResolve: (id: string) => void;
  /** Overview's per-domain columns are already narrow — force a single column. */
  compact?: boolean;
}

export default function RedlineGrid({
  domainLabel,
  hasGoals,
  active,
  wins = [],
  resolvingIds,
  onResolve,
  compact = false,
}: RedlineGridProps) {
  if (!hasGoals) {
    return <NoPlanState domainLabel={domainLabel} compact={compact} />;
  }

  const gridCols = compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";

  return (
    <div className="flex flex-col gap-4">
      {active.length === 0 ? (
        <CleanSheet domainLabel={domainLabel} compact={compact} />
      ) : (
        <div className={`grid gap-3 ${gridCols}`}>
          {active.map((redline) => (
            <RedlineCard
              key={redline.id}
              redline={redline}
              resolving={resolvingIds.has(redline.id)}
              onResolve={onResolve}
            />
          ))}
        </div>
      )}

      {wins.length > 0 && (
        <div className={`grid gap-3 ${gridCols}`}>
          {wins.map((win) => (
            <WinCard key={win.id} win={win} />
          ))}
        </div>
      )}
    </div>
  );
}
