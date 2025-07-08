CREATE TABLE IF NOT EXISTS "buckets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"target_value" numeric(10, 2) NOT NULL,
	"current_value" numeric(10, 2) DEFAULT '0' NOT NULL,
	"index" integer NOT NULL,
	"filter_method" varchar(20) NOT NULL,
	"filter_value" numeric(10, 2) NOT NULL,
	"has_minimum_hold" boolean DEFAULT false NOT NULL,
	"hold_type" varchar(20),
	"hold_value" numeric(10, 2),
	"is_locked" boolean DEFAULT false NOT NULL,
	"is_full" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "money_buckets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"current_value" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total_redistributed" numeric(10, 2) DEFAULT '0' NOT NULL,
	"last_redistribution_at" timestamp,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bucket_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"balance_before" numeric(10, 2) NOT NULL,
	"balance_after" numeric(10, 2) NOT NULL,
	"was_filled" boolean DEFAULT false NOT NULL,
	"transaction_type" varchar(50) NOT NULL,
	"bucket_id" uuid NOT NULL,
	"deposit_transaction_id" uuid,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deposit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_amount" numeric(10, 2) NOT NULL,
	"total_processed" numeric(10, 2) NOT NULL,
	"money_bucket_amount" numeric(10, 2) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "money_bucket_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"balance_before" numeric(10, 2) NOT NULL,
	"balance_after" numeric(10, 2) NOT NULL,
	"transaction_type" varchar(50) NOT NULL,
	"money_bucket_id" uuid NOT NULL,
	"deposit_transaction_id" uuid,
	"target_bucket_id" uuid,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "buckets" ADD CONSTRAINT "buckets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "money_buckets" ADD CONSTRAINT "money_buckets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bucket_transactions" ADD CONSTRAINT "bucket_transactions_bucket_id_buckets_id_fk" FOREIGN KEY ("bucket_id") REFERENCES "buckets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bucket_transactions" ADD CONSTRAINT "bucket_transactions_deposit_transaction_id_deposit_transactions_id_fk" FOREIGN KEY ("deposit_transaction_id") REFERENCES "deposit_transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bucket_transactions" ADD CONSTRAINT "bucket_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deposit_transactions" ADD CONSTRAINT "deposit_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "money_bucket_transactions" ADD CONSTRAINT "money_bucket_transactions_money_bucket_id_money_buckets_id_fk" FOREIGN KEY ("money_bucket_id") REFERENCES "money_buckets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "money_bucket_transactions" ADD CONSTRAINT "money_bucket_transactions_deposit_transaction_id_deposit_transactions_id_fk" FOREIGN KEY ("deposit_transaction_id") REFERENCES "deposit_transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "money_bucket_transactions" ADD CONSTRAINT "money_bucket_transactions_target_bucket_id_buckets_id_fk" FOREIGN KEY ("target_bucket_id") REFERENCES "buckets"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "money_bucket_transactions" ADD CONSTRAINT "money_bucket_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
