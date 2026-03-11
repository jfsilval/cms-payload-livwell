import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- pages_locales
    CREATE TABLE IF NOT EXISTS "pages_locales" (
      "id" serial PRIMARY KEY NOT NULL,
      "meta_title" varchar,
      "meta_image_id" integer,
      "meta_description" varchar,
      "_locale" varchar NOT NULL,
      "_parent_id" integer NOT NULL,
      UNIQUE ("_locale", "_parent_id")
    );

    INSERT INTO "pages_locales" ("meta_title", "meta_image_id", "meta_description", "_locale", "_parent_id")
    SELECT "meta_title", "meta_image_id", "meta_description", 'en', "id" FROM "pages"
    ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_locales_meta_image_id_media_id_fk') THEN
        ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk"
          FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_locales_parent_id_fk') THEN
        ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_title";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_image_id";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_description";

    -- _pages_v_locales
    CREATE TABLE IF NOT EXISTS "_pages_v_locales" (
      "id" serial PRIMARY KEY NOT NULL,
      "version_meta_title" varchar,
      "version_meta_image_id" integer,
      "version_meta_description" varchar,
      "_locale" varchar NOT NULL,
      "_parent_id" integer NOT NULL,
      UNIQUE ("_locale", "_parent_id")
    );

    INSERT INTO "_pages_v_locales" ("version_meta_title", "version_meta_image_id", "version_meta_description", "_locale", "_parent_id")
    SELECT "version_meta_title", "version_meta_image_id", "version_meta_description", 'en', "id" FROM "_pages_v"
    ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_locales_version_meta_image_id_media_id_fk') THEN
        ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk"
          FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_locales_parent_id_fk') THEN
        ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_meta_title";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_meta_image_id";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_meta_description";
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
