CREATE TYPE "public"."admin_permission" AS ENUM('dashboard', 'users', 'profiles', 'reports', 'contact', 'billing', 'content');--> statement-breakpoint
ALTER TYPE "public"."profile_role" ADD VALUE 'super_admin';--> statement-breakpoint
CREATE TABLE "admin_permissions" (
	"user_id" text NOT NULL,
	"permission" "admin_permission" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_permissions_user_id_permission_pk" PRIMARY KEY("user_id","permission")
);
--> statement-breakpoint
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;