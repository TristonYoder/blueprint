CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"card_kind" text NOT NULL,
	"card_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp with time zone
);
