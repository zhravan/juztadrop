CREATE TYPE "public"."application_status" AS ENUM('pending', 'accepted', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."opportunity_mode" AS ENUM('onsite', 'remote', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."opportunity_status" AS ENUM('draft', 'active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" text PRIMARY KEY NOT NULL,
	"ngo_id" text NOT NULL,
	"user_created_by" text NOT NULL,
	"user_updated_by" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"cause_category_names" text[] DEFAULT '{}' NOT NULL,
	"required_skills" text[] DEFAULT '{}',
	"max_volunteers" integer,
	"min_volunteers" integer,
	"language_preference" text,
	"gender_preference" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"start_time" text,
	"end_time" text,
	"status" "opportunity_status" DEFAULT 'draft' NOT NULL,
	"opportunity_mode" "opportunity_mode" NOT NULL,
	"osrm_link" text,
	"address" text,
	"city" text,
	"state" text,
	"country" text DEFAULT 'India',
	"contact_name" text NOT NULL,
	"contact_phone_number" text,
	"contact_email" text NOT NULL,
	"stipend_info" jsonb,
	"is_certificate_offered" boolean DEFAULT false NOT NULL,
	"banner_image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunity_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"opportunity_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_ngo_id_organizations_id_fk" FOREIGN KEY ("ngo_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_user_created_by_users_id_fk" FOREIGN KEY ("user_created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_user_updated_by_users_id_fk" FOREIGN KEY ("user_updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "opportunities_ngo_id_idx" ON "opportunities" USING btree ("ngo_id");--> statement-breakpoint
CREATE INDEX "opportunities_user_created_by_idx" ON "opportunities" USING btree ("user_created_by");--> statement-breakpoint
CREATE INDEX "opportunities_status_idx" ON "opportunities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "opportunities_mode_idx" ON "opportunities" USING btree ("opportunity_mode");--> statement-breakpoint
CREATE INDEX "opportunities_city_idx" ON "opportunities" USING btree ("city");--> statement-breakpoint
CREATE INDEX "opportunities_state_idx" ON "opportunities" USING btree ("state");--> statement-breakpoint
CREATE INDEX "opportunities_country_idx" ON "opportunities" USING btree ("country");--> statement-breakpoint
CREATE INDEX "opportunities_start_date_idx" ON "opportunities" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "opportunities_end_date_idx" ON "opportunities" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "opportunities_cause_categories_idx" ON "opportunities" USING btree ("cause_category_names");--> statement-breakpoint
CREATE INDEX "opportunities_required_skills_idx" ON "opportunities" USING btree ("required_skills");--> statement-breakpoint
CREATE INDEX "applications_opp_user_idx" ON "opportunity_applications" USING btree ("opportunity_id","user_id");--> statement-breakpoint
CREATE INDEX "applications_opp_id_idx" ON "opportunity_applications" USING btree ("opportunity_id");--> statement-breakpoint
CREATE INDEX "applications_user_id_idx" ON "opportunity_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "opportunity_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "organizations_city_idx" ON "organizations" USING btree ("city");--> statement-breakpoint
CREATE INDEX "organizations_state_idx" ON "organizations" USING btree ("state");--> statement-breakpoint
CREATE INDEX "organizations_country_idx" ON "organizations" USING btree ("country");--> statement-breakpoint
CREATE INDEX "organizations_causes_idx" ON "organizations" USING btree ("causes");