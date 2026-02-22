CREATE TABLE "moderator_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"moderator_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "moderator_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "moderator_sessions" ADD CONSTRAINT "moderator_sessions_moderator_id_moderators_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."moderators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_moderator_id_idx" ON "moderator_sessions" USING btree ("moderator_id");--> statement-breakpoint
CREATE INDEX "sessions_moderator_token_idx" ON "moderator_sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_moderator_expires_at_idx" ON "moderator_sessions" USING btree ("expires_at");