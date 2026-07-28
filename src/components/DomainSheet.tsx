"use client";

import { useState } from "react";
import type { Redline } from "@/types/blueprint";
import TitleBlock from "./TitleBlock";
import RedlineCard from "./RedlineCard";
import CleanSheet from "./CleanSheet";
import NoPlanState from "./NoPlanState";

interface DomainSheetProps {
  sheetName: string;
  revision: string;
  dateLabel: string;
  domainLabel: string;
  redlines: Redline[];
  hasGoals: boolean;
}

// Owns the resolve/stamp interaction so the title block's live obstruction
// count and the card list stay in sync. Only "action" redlines resolve this
// way — "reference" and "sync-error" cards clear only when the underlying
// source data changes, never by dismissal (see RedlineCard).
export default function DomainSheet({
  sheetName,
  revision,
  dateLabel,
  domainLabel,
  redlines,
  hasGoals,
}: DomainSheetProps) {
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  function handleResolve(id: string) {
    setResolvingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setResolvedIds((prev) => new Set(prev).add(id));
    }, 500);
  }

  const active = redlines.filter((r) => !resolvedIds.has(r.id));

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
        {!hasGoals ? (
          <NoPlanState domainLabel={domainLabel} />
        ) : active.length === 0 ? (
          <CleanSheet domainLabel={domainLabel} />
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {active.map((redline) => (
              <RedlineCard
                key={redline.id}
                redline={redline}
                resolving={resolvingIds.has(redline.id)}
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
