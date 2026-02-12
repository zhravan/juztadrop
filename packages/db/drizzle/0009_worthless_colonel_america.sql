CREATE TYPE "public"."moderation_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('open', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."moderation_type" AS ENUM('user', 'event', 'ngo');--> statement-breakpoint
CREATE TABLE "moderation_monitoring" (
	"id" text PRIMARY KEY NOT NULL,
	"moderation_type" "moderation_type" NOT NULL,
	"reasons" text NOT NULL,
	"target_metadata" jsonb,
	"status" "moderation_status" DEFAULT 'open' NOT NULL,
	"priority" "moderation_priority" DEFAULT 'medium' NOT NULL,
	"reported_by" text NOT NULL,
	"assigned_to" text,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"resolution_notes" text,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "moderation_monitoring" ADD CONSTRAINT "moderation_monitoring_reported_by_users_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_monitoring" ADD CONSTRAINT "moderation_monitoring_assigned_to_moderators_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."moderators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_monitoring" ADD CONSTRAINT "moderation_monitoring_reviewed_by_moderators_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."moderators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "moderation_monitoring_type_idx" ON "moderation_monitoring" USING btree ("moderation_type");--> statement-breakpoint
CREATE INDEX "moderation_monitoring_status_idx" ON "moderation_monitoring" USING btree ("status");--> statement-breakpoint
CREATE INDEX "moderation_monitoring_priority_idx" ON "moderation_monitoring" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "moderation_monitoring_reported_by_idx" ON "moderation_monitoring" USING btree ("reported_by");--> statement-breakpoint
CREATE INDEX "moderation_monitoring_assigned_to_idx" ON "moderation_monitoring" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "moderation_monitoring_reviewed_by_idx" ON "moderation_monitoring" USING btree ("reviewed_by");--> statement-breakpoint
CREATE INDEX "moderation_monitoring_created_at_idx" ON "moderation_monitoring" USING btree ("created_at");