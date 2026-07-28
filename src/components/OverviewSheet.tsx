"use client";

import type { Domain, Goal, Redline, Win } from "@/types/blueprint";
import { useRedlineResolution } from "@/hooks/useRedlineResolution";
import TitleBlock from "./TitleBlock";
import RedlineGrid from "./RedlineGrid";

interface OverviewSheetProps {
  revision: string;
  dateLabel: string;
  redlines: Redline[];
  wins?: Win[];
  goals: Goal[];
}

const DOMAINS: { key: Domain; code: string; label: string }[] = [
  { key: "personal", code: "A-101", label: "Personal" },
  { key: "work", code: "A-201", label: "Work" },
  { key: "shared", code: "A-301", label: "Shared" },
];

// The overview aggregates all three domains — on a wide screen a single
// merged list wastes the width and forces a long scroll to see what's in
// each area. Splitting into domain columns keeps the whole plan scannable
// at once; each column still reduces to the same clean/no-plan states as
// its own dedicated sheet.
export default function OverviewSheet({
  revision,
  dateLabel,
  redlines,
  wins = [],
  goals,
}: OverviewSheetProps) {
  const { active, resolvingIds, handleResolve } = useRedlineResolution(redlines);
  const hasAnyGoals = goals.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      <TitleBlock
        sheetName="OVERVIEW"
        revision={revision}
        dateLabel={dateLabel}
        obstructionCount={active.length}
        hasGoals={hasAnyGoals}
      />
      <div className="bp-grid flex-1 p-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {DOMAINS.map((domain) => {
            const domainHasGoals = goals.some((g) => g.domain === domain.key);
            const domainActive = active.filter((r) => r.domain === domain.key);
            const domainWins = wins.filter((w) => w.domain === domain.key);

            return (
              <div key={domain.key} className="flex flex-col gap-3">
                <div className="flex items-baseline gap-2 border-b border-bp-line pb-2">
                  <span className="bp-label text-bp-ink-faint">{domain.code}</span>
                  <span className="bp-label text-bp-ink">{domain.label}</span>
                </div>
                <RedlineGrid
                  domainLabel={domain.label}
                  hasGoals={domainHasGoals}
                  active={domainActive}
                  wins={domainWins}
                  resolvingIds={resolvingIds}
                  onResolve={handleResolve}
                  compact
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
