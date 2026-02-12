ALTER TABLE "moderation_monitoring" DROP CONSTRAINT "moderation_monitoring_assigned_to_moderators_id_fk";
--> statement-breakpoint
ALTER TABLE "moderation_monitoring" DROP CONSTRAINT "moderation_monitoring_reviewed_by_moderators_id_fk";
--> statement-breakpoint
ALTER TABLE "moderation_monitoring" ADD CONSTRAINT "moderation_monitoring_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_monitoring" ADD CONSTRAINT "moderation_monitoring_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;