CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"label" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "redlines" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"domain" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"detail" text NOT NULL,
	"source" text NOT NULL,
	"source_href" text,
	"action_label" text,
	"visual" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wins" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"domain" text NOT NULL,
	"title" text NOT NULL,
	"detail" text NOT NULL,
	"source" text NOT NULL,
	"source_href" text,
	"visual" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
