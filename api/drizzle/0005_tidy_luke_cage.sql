CREATE TABLE "organization_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organization_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "type" text;