ALTER TABLE "profile_preferences" ADD COLUMN "notify_matches" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_preferences" ADD COLUMN "notify_messages" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_preferences" ADD COLUMN "notify_requests" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_preferences" ADD COLUMN "notify_marketing" boolean DEFAULT false NOT NULL;