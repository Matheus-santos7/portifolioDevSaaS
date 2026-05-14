-- AlterTable
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "coverImage" BYTEA;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "coverMime" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "hasStoredCover" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Project"
SET "hasStoredCover" = true
WHERE "coverImage" IS NOT NULL AND length("coverImage") > 0;
