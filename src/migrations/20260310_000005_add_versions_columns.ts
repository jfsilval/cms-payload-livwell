import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- _posts_v: agregar columnas faltantes
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "snapshot" jsonb;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "published_locale" varchar;

    -- _pages_v: snapshot ya existe (migración 000001), solo falta published_locale
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "published_locale" varchar;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
