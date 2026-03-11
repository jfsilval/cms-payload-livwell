import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "categories_breadcrumbs"
      ADD COLUMN IF NOT EXISTS "_locale" varchar NOT NULL DEFAULT 'en';
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
