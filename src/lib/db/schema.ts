import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const goals = pgTable("goals", {
  id: text("id").primaryKey(),
  domain: text("domain").notNull(), // Domain
  label: text("label").notNull(),
});

export const redlines = pgTable("redlines", {
  id: text("id").primaryKey(),
  goalId: text("goal_id").notNull(),
  domain: text("domain").notNull(), // Domain
  kind: text("kind").notNull(), // RedlineKind
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  source: text("source").notNull(),
  sourceHref: text("source_href"),
  actionLabel: text("action_label"),
  visual: jsonb("visual"), // CardVisual | null
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const wins = pgTable("wins", {
  id: text("id").primaryKey(),
  goalId: text("goal_id").notNull(),
  domain: text("domain").notNull(), // Domain
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  source: text("source").notNull(),
  sourceHref: text("source_href"),
  visual: jsonb("visual"), // CardVisual | null
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Loosely referenced by (cardKind, cardId) rather than a real FK — matches
// goalId's existing loose-reference convention above. A comment outlives
// its card's resolution only until that card is deleted; there's no
// orphan cleanup in v1.
export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  cardKind: text("card_kind").notNull(), // CardKind ("redline" | "win")
  cardId: text("card_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
});
