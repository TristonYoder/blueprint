"use client";

import type { Redline } from "@/types/blueprint";
import { useRedlineResolution } from "@/hooks/useRedlineResolution";
import TitleBlock from "./TitleBlock";
import RedlineGrid from "./RedlineGrid";

interface DomainSheetProps {
  sheetName: string;
  revision: string;
  dateLabel: string;
  domainLabel: string;
  redlines: Redline[];
  hasGoals: boolean;
}

// Single-domain sheet (Personal/Work/Shared). Cards flow into a responsive
// grid on wide screens rather than staying pinned to one narrow column —
// dashboard scannability wins over a strict single-sheet reading order once
// there's room for it.
export default function DomainSheet({
  sheetName,
  revision,
  dateLabel,
  domainLabel,
  redlines,
  hasGoals,
}: DomainSheetProps) {
  const { active, resolvingIds, handleResolve } = useRedlineResolution(redlines);

  return (
    <div className="flex flex-1 flex-col">
      <TitleBlock
        sheetName={sheetName}
        revision={revision}
        dateLabel={dateLabel}
        obstructionCount={active.length}
        hasGoals={hasGoals}
      />
      <div className="bp-grid flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <RedlineGrid
            domainLabel={domainLabel}
            hasGoals={hasGoals}
            active={active}
            resolvingIds={resolvingIds}
            onResolve={handleResolve}
          />
        </div>
      </div>
    </div>
  );
}
