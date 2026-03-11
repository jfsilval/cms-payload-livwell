import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Add snapshot column to _pages_v (Payload v3 internal requirement)
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "snapshot" jsonb;

    -- 2. posts_locales: localized fields for posts collection
    CREATE TABLE IF NOT EXISTS "posts_locales" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "content" jsonb,
      "_locale" varchar NOT NULL,
      "_parent_id" integer NOT NULL,
      UNIQUE ("_locale", "_parent_id")
    );

    INSERT INTO "posts_locales" ("title", "content", "_locale", "_parent_id")
    SELECT "title", "content", 'en', "id" FROM "posts"
    ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

    ALTER TABLE "posts_locales"
      ADD CONSTRAINT "posts_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "posts" DROP COLUMN IF EXISTS "title";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "content";

    -- 3. _posts_v_locales: localized fields for post versions
    CREATE TABLE IF NOT EXISTS "_posts_v_locales" (
      "id" serial PRIMARY KEY NOT NULL,
      "version_title" varchar,
      "version_content" jsonb,
      "_locale" varchar NOT NULL,
      "_parent_id" integer NOT NULL,
      UNIQUE ("_locale", "_parent_id")
    );

    INSERT INTO "_posts_v_locales" ("version_title", "version_content", "_locale", "_parent_id")
    SELECT "version_title", "version_content", 'en', "id" FROM "_posts_v"
    ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

    ALTER TABLE "_posts_v_locales"
      ADD CONSTRAINT "_posts_v_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_title";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_content";

    -- 4. products_locales: localized fields for products collection
    CREATE TABLE IF NOT EXISTS "products_locales" (
      "id" serial PRIMARY KEY NOT NULL,
      "categoria" varchar,
      "sub_categoria" varchar,
      "forma_farmaceutica" varchar,
      "_locale" varchar NOT NULL,
      "_parent_id" integer NOT NULL,
      UNIQUE ("_locale", "_parent_id")
    );

    INSERT INTO "products_locales" ("categoria", "sub_categoria", "forma_farmaceutica", "_locale", "_parent_id")
    SELECT "categoria", "sub_categoria", "forma_farmaceutica", 'en', "id" FROM "products"
    ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

    ALTER TABLE "products_locales"
      ADD CONSTRAINT "products_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "products" DROP COLUMN IF EXISTS "categoria";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "sub_categoria";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "forma_farmaceutica";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore posts columns
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "title" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "content" jsonb;
    UPDATE "posts" p SET "title" = pl."title", "content" = pl."content"
      FROM "posts_locales" pl WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'en';
    DROP TABLE IF EXISTS "posts_locales";

    -- Restore _posts_v columns
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_title" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_content" jsonb;
    UPDATE "_posts_v" v SET "version_title" = vl."version_title", "version_content" = vl."version_content"
      FROM "_posts_v_locales" vl WHERE vl."_parent_id" = v."id" AND vl."_locale" = 'en';
    DROP TABLE IF EXISTS "_posts_v_locales";

    -- Restore products columns
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "categoria" varchar;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sub_categoria" varchar;
    ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "forma_farmaceutica" varchar;
    UPDATE "products" p
      SET "categoria" = pl."categoria", "sub_categoria" = pl."sub_categoria",
          "forma_farmaceutica" = pl."forma_farmaceutica"
      FROM "products_locales" pl WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'en';
    DROP TABLE IF EXISTS "products_locales";

    -- Remove snapshot
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "snapshot";
  `)
}

