"use client";

import { useState } from "react";
import type { Redline } from "@/types/blueprint";

// Only "action" redlines resolve this way — "reference" and "sync-error"
// cards clear only when the underlying source data changes, never by
// dismissal (see RedlineCard). Shared by DomainSheet and OverviewSheet so
// resolve state and the resolving-flourish timing stay identical everywhere.
export function useRedlineResolution(redlines: Redline[]) {
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  function handleResolve(id: string) {
    setResolvingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setResolvedIds((prev) => new Set(prev).add(id));
    }, 500);
  }

  const active = redlines.filter((r) => !resolvedIds.has(r.id));

  return { active, resolvingIds, handleResolve };
}
