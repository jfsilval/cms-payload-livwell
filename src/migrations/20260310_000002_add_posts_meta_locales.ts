import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- posts_locales: agregar campos SEO faltantes
    ALTER TABLE "posts_locales" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
    ALTER TABLE "posts_locales" ADD COLUMN IF NOT EXISTS "meta_image_id" integer;
    ALTER TABLE "posts_locales" ADD COLUMN IF NOT EXISTS "meta_description" varchar;

    UPDATE "posts_locales" pl
    SET
      "meta_title"       = p."meta_title",
      "meta_image_id"    = p."meta_image_id",
      "meta_description" = p."meta_description"
    FROM "posts" p
    WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'en';

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'posts_locales_meta_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "posts_locales"
          ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk"
          FOREIGN KEY ("meta_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    ALTER TABLE "posts" DROP COLUMN IF EXISTS "meta_title";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "meta_image_id";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "meta_description";

    -- _posts_v_locales: agregar campos SEO faltantes
    ALTER TABLE "_posts_v_locales" ADD COLUMN IF NOT EXISTS "version_meta_title" varchar;
    ALTER TABLE "_posts_v_locales" ADD COLUMN IF NOT EXISTS "version_meta_image_id" integer;
    ALTER TABLE "_posts_v_locales" ADD COLUMN IF NOT EXISTS "version_meta_description" varchar;

    UPDATE "_posts_v_locales" pvl
    SET
      "version_meta_title"       = pv."version_meta_title",
      "version_meta_image_id"    = pv."version_meta_image_id",
      "version_meta_description" = pv."version_meta_description"
    FROM "_posts_v" pv
    WHERE pvl."_parent_id" = pv."id" AND pvl."_locale" = 'en';

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_posts_v_locales_version_meta_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "_posts_v_locales"
          ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk"
          FOREIGN KEY ("version_meta_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_meta_title";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_meta_image_id";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_meta_description";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {}
