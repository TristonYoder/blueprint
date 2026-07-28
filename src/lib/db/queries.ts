import { eq } from "drizzle-orm";
import { db } from "./index";
import { goals, redlines, wins } from "./schema";
import type { CardVisual, Domain, Goal, Redline, RedlineKind, Win } from "@/types/blueprint";

function toGoal(row: typeof goals.$inferSelect): Goal {
  return { id: row.id, domain: row.domain as Domain, label: row.label };
}

function toRedline(row: typeof redlines.$inferSelect): Redline {
  return {
    id: row.id,
    goalId: row.goalId,
    domain: row.domain as Domain,
    kind: row.kind as RedlineKind,
    title: row.title,
    detail: row.detail,
    source: row.source,
    sourceHref: row.sourceHref ?? undefined,
    actionLabel: row.actionLabel ?? undefined,
    visual: (row.visual as CardVisual | null) ?? undefined,
  };
}

function toWin(row: typeof wins.$inferSelect): Win {
  return {
    id: row.id,
    goalId: row.goalId,
    domain: row.domain as Domain,
    title: row.title,
    detail: row.detail,
    source: row.source,
    sourceHref: row.sourceHref ?? undefined,
    visual: (row.visual as CardVisual | null) ?? undefined,
  };
}

export async function getGoals(): Promise<Goal[]> {
  const rows = await db.select().from(goals);
  return rows.map(toGoal);
}

export async function getRedlines(): Promise<Redline[]> {
  const rows = await db.select().from(redlines).orderBy(redlines.createdAt);
  return rows.map(toRedline);
}

export async function getWins(): Promise<Win[]> {
  const rows = await db.select().from(wins).orderBy(wins.createdAt);
  return rows.map(toWin);
}

export interface CreateRedlineInput {
  id: string;
  goalId: string;
  domain: Domain;
  kind: RedlineKind;
  title: string;
  detail: string;
  source: string;
  sourceHref?: string;
  actionLabel?: string;
  visual?: CardVisual;
}

export async function createRedline(input: CreateRedlineInput): Promise<void> {
  await db.insert(redlines).values(input);
}

export interface CreateWinInput {
  id: string;
  goalId: string;
  domain: Domain;
  title: string;
  detail: string;
  source: string;
  sourceHref?: string;
  visual?: CardVisual;
}

export async function createWin(input: CreateWinInput): Promise<void> {
  await db.insert(wins).values(input);
}

/** Resolving/clearing a redline just removes it — v1 keeps no history. */
export async function removeRedline(id: string): Promise<void> {
  await db.delete(redlines).where(eq(redlines.id, id));
}

export async function removeWin(id: string): Promise<void> {
  await db.delete(wins).where(eq(wins.id, id));
}
