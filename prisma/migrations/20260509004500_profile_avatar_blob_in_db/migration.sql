ALTER TABLE "public"."Profile"
ADD COLUMN IF NOT EXISTS "avatarImage" BYTEA;

ALTER TABLE "public"."Profile"
ADD COLUMN IF NOT EXISTS "avatarMime" TEXT;

ALTER TABLE "public"."Profile"
ADD COLUMN IF NOT EXISTS "hasStoredAvatar" BOOLEAN NOT NULL DEFAULT false;

UPDATE "public"."Profile"
SET "hasStoredAvatar" = true
WHERE "avatarImage" IS NOT NULL AND length("avatarImage") > 0;
