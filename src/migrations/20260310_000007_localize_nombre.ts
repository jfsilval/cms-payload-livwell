import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

    -- Añadir nombre a products_locales (antes era campo no-localizado)
    ALTER TABLE "products_locales" ADD COLUMN IF NOT EXISTS "nombre" varchar;

    -- Copiar datos EN de products → products_locales (locale='en')
    DO $$ BEGIN
      UPDATE "products_locales" pl
      SET "nombre" = p."nombre"
      FROM "products" p
      WHERE pl."_parent_id" = p."id"
        AND pl."_locale" = 'en'
        AND pl."nombre" IS NULL;
    EXCEPTION WHEN undefined_column THEN NULL; WHEN undefined_table THEN NULL; END $$;

    -- Eliminar nombre de products (ahora vive en products_locales)
    ALTER TABLE "products" DROP COLUMN IF EXISTS "nombre";

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // down migration not implemented
}
