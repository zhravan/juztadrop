CREATE TYPE "public"."organization_verification_action" AS ENUM('request_for_change', 'verified', 'rejected', 'suspended', 'reinstate');--> statement-breakpoint
CREATE TABLE "organization_verification_history" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"action" "organization_verification_action" NOT NULL,
	"from_status" "organization_status" NOT NULL,
	"to_status" "organization_status" NOT NULL,
	"description" text,
	"moderator_id" text NOT NULL,
	"moderator_name" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "org_verification_history_description_length_check" CHECK ("organization_verification_history"."description" IS NULL OR char_length("organization_verification_history"."description") <= 5000)
);
--> statement-breakpoint
ALTER TABLE "organization_verification_history" ADD CONSTRAINT "organization_verification_history_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_verification_history" ADD CONSTRAINT "organization_verification_history_moderator_id_moderators_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."moderators"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "org_verification_history_org_id_idx" ON "organization_verification_history" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "org_verification_history_moderator_id_idx" ON "organization_verification_history" USING btree ("moderator_id");--> statement-breakpoint
CREATE INDEX "org_verification_history_created_at_idx" ON "organization_verification_history" USING btree ("created_at");