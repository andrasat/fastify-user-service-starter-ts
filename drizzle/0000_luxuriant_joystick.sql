CREATE SCHEMA "user_schema";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_schema"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
