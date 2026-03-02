import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products" (
      "id" serial PRIMARY KEY NOT NULL,
      "nombre" varchar NOT NULL,
      "categoria" varchar NOT NULL,
      "sub_categoria" varchar,
      "clasificacion_atc" varchar,
      "activo" boolean DEFAULT true,
      "forma_farmaceutica" varchar,
      "concentraciones" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "products_id" integer;
    CREATE INDEX IF NOT EXISTS "products_updated_at_idx"
      ON "products" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "products_created_at_idx"
      ON "products" USING btree ("created_at");
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT IF NOT EXISTS "payload_locked_documents_rels_products_fk"
      FOREIGN KEY ("products_id") REFERENCES "public"."products"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx"
      ON "payload_locked_documents_rels" USING btree ("products_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_products_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_products_id_idx";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "products_id";
    DROP TABLE IF EXISTS "products";
  `)
}
