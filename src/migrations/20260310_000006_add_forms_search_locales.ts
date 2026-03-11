import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- forms_locales
    CREATE TABLE IF NOT EXISTS "forms_locales" (
      "id" serial PRIMARY KEY NOT NULL,
      "submit_button_label" varchar,
      "confirmation_message" jsonb,
      "_locale" varchar NOT NULL,
      "_parent_id" integer NOT NULL,
      UNIQUE ("_locale", "_parent_id")
    );
    DO $$ BEGIN
      INSERT INTO "forms_locales" ("submit_button_label", "confirmation_message", "_locale", "_parent_id")
      SELECT "submit_button_label", "confirmation_message", 'en', "id" FROM "forms"
      ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
    EXCEPTION WHEN undefined_column THEN NULL; WHEN undefined_table THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    ALTER TABLE "forms" DROP COLUMN IF EXISTS "submit_button_label";
    ALTER TABLE "forms" DROP COLUMN IF EXISTS "confirmation_message";

    -- forms_emails_locales
    CREATE TABLE IF NOT EXISTS "forms_emails_locales" (
      "id" serial PRIMARY KEY NOT NULL,
      "subject" varchar,
      "message" jsonb,
      "_locale" varchar NOT NULL,
      "_parent_id" integer NOT NULL,
      UNIQUE ("_locale", "_parent_id")
    );
    DO $$ BEGIN
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_emails') THEN
        INSERT INTO "forms_emails_locales" ("subject", "message", "_locale", "_parent_id")
        SELECT "subject", "message", 'en', "id" FROM "forms_emails"
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
        ALTER TABLE "forms_emails" DROP COLUMN IF EXISTS "subject";
        ALTER TABLE "forms_emails" DROP COLUMN IF EXISTS "message";
        ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- forms block locale tables
    CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_country_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_email_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_message_locales" ("id" serial PRIMARY KEY NOT NULL, "message" jsonb, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_number_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_select_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "default_value" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_select_options_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_state_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_text_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "default_value" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));
    CREATE TABLE IF NOT EXISTS "forms_blocks_textarea_locales" ("id" serial PRIMARY KEY NOT NULL, "label" varchar, "default_value" varchar, "_locale" varchar NOT NULL, "_parent_id" integer NOT NULL, UNIQUE ("_locale", "_parent_id"));

    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_checkbox') THEN ALTER TABLE "forms_blocks_checkbox" DROP COLUMN IF EXISTS "label"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_country') THEN ALTER TABLE "forms_blocks_country" DROP COLUMN IF EXISTS "label"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_email') THEN ALTER TABLE "forms_blocks_email" DROP COLUMN IF EXISTS "label"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_message') THEN ALTER TABLE "forms_blocks_message" DROP COLUMN IF EXISTS "message"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_number') THEN ALTER TABLE "forms_blocks_number" DROP COLUMN IF EXISTS "label"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_select') THEN ALTER TABLE "forms_blocks_select" DROP COLUMN IF EXISTS "label"; ALTER TABLE "forms_blocks_select" DROP COLUMN IF EXISTS "default_value"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_select_options') THEN ALTER TABLE "forms_blocks_select_options" DROP COLUMN IF EXISTS "label"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_state') THEN ALTER TABLE "forms_blocks_state" DROP COLUMN IF EXISTS "label"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_text') THEN ALTER TABLE "forms_blocks_text" DROP COLUMN IF EXISTS "label"; ALTER TABLE "forms_blocks_text" DROP COLUMN IF EXISTS "default_value"; END IF; END $$;
    DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE schemaname='public' AND tablename='forms_blocks_textarea') THEN ALTER TABLE "forms_blocks_textarea" DROP COLUMN IF EXISTS "label"; ALTER TABLE "forms_blocks_textarea" DROP COLUMN IF EXISTS "default_value"; END IF; END $$;

    -- search_locales
    CREATE TABLE IF NOT EXISTS "search_locales" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "_locale" varchar NOT NULL,
      "_parent_id" integer NOT NULL,
      UNIQUE ("_locale", "_parent_id")
    );
    INSERT INTO "search_locales" ("title", "_locale", "_parent_id")
    SELECT "title", 'en', "id" FROM "search"
    ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
    DO $$ BEGIN
      ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    ALTER TABLE "search" DROP COLUMN IF EXISTS "title";
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
