import { eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { goals, redlines, wins, comments } from "./schema";
import type {
  CardKind,
  CardVisual,
  Comment,
  Domain,
  Goal,
  Redline,
  RedlineKind,
  Win,
} from "@/types/blueprint";

function toGoal(row: typeof goals.$inferSelect): Goal {
  return { id: row.id, domain: row.domain as Domain, label: row.label };
}

function toComment(row: typeof comments.$inferSelect): Comment {
  return {
    id: row.id,
    cardKind: row.cardKind as CardKind,
    cardId: row.cardId,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    acknowledgedAt: row.acknowledgedAt?.toISOString() ?? undefined,
  };
}

function toRedline(row: typeof redlines.$inferSelect, cardComments: Comment[]): Redline {
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
    comments: cardComments,
  };
}

function toWin(row: typeof wins.$inferSelect, cardComments: Comment[]): Win {
  return {
    id: row.id,
    goalId: row.goalId,
    domain: row.domain as Domain,
    title: row.title,
    detail: row.detail,
    source: row.source,
    sourceHref: row.sourceHref ?? undefined,
    visual: (row.visual as CardVisual | null) ?? undefined,
    comments: cardComments,
  };
}

async function commentsByCardId(cardKind: CardKind, cardIds: string[]): Promise<Map<string, Comment[]>> {
  const map = new Map<string, Comment[]>();
  if (cardIds.length === 0) return map;

  const rows = await db
    .select()
    .from(comments)
    .where(inArray(comments.cardId, cardIds))
    .orderBy(comments.createdAt);

  for (const row of rows) {
    if (row.cardKind !== cardKind) continue;
    const list = map.get(row.cardId) ?? [];
    list.push(toComment(row));
    map.set(row.cardId, list);
  }
  return map;
}

export async function getGoals(): Promise<Goal[]> {
  const rows = await db.select().from(goals);
  return rows.map(toGoal);
}

export async function getRedlines(): Promise<Redline[]> {
  const rows = await db.select().from(redlines).orderBy(redlines.createdAt);
  const commentMap = await commentsByCardId(
    "redline",
    rows.map((r) => r.id),
  );
  return rows.map((row) => toRedline(row, commentMap.get(row.id) ?? []));
}

export async function getWins(): Promise<Win[]> {
  const rows = await db.select().from(wins).orderBy(wins.createdAt);
  const commentMap = await commentsByCardId(
    "win",
    rows.map((r) => r.id),
  );
  return rows.map((row) => toWin(row, commentMap.get(row.id) ?? []));
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
  await db.delete(comments).where(eq(comments.cardId, id));
}

export async function removeWin(id: string): Promise<void> {
  await db.delete(wins).where(eq(wins.id, id));
  await db.delete(comments).where(eq(comments.cardId, id));
}

export interface CreateCommentInput {
  id: string;
  cardKind: CardKind;
  cardId: string;
  body: string;
}

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const [row] = await db.insert(comments).values(input).returning();
  return toComment(row);
}

export async function acknowledgeComment(id: string): Promise<void> {
  await db.update(comments).set({ acknowledgedAt: new Date() }).where(eq(comments.id, id));
}
