CREATE TYPE "public"."document_type" AS ENUM('registration_certificate', '80G_certificate', '12A_certificate', 'PAN');--> statement-breakpoint
CREATE TABLE "organization_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"ngo_id" text NOT NULL,
	"document_type" "document_type" NOT NULL,
	"document_asset_url" text NOT NULL,
	"format" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization_documents" ADD CONSTRAINT "organization_documents_ngo_id_organizations_id_fk" FOREIGN KEY ("ngo_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "org_documents_ngo_id_idx" ON "organization_documents" USING btree ("ngo_id");--> statement-breakpoint
CREATE INDEX "org_documents_type_idx" ON "organization_documents" USING btree ("document_type");