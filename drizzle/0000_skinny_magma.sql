CREATE TABLE IF NOT EXISTS "orgs" (
	"org_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"license_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"is_done" boolean,
	"owner_id" text,
	"created_on" timestamp,
	"created_by_id" text
);
