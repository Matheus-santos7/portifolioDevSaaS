-- AlterTable (idempotente — coluna pode já existir por drift / db push)
ALTER TABLE "Technology" ADD COLUMN IF NOT EXISTS "svgUrl" TEXT;
