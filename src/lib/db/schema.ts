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
