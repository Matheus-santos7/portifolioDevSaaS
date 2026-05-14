CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "User_email_key" UNIQUE ("email")
);

ALTER TABLE "Profile"
ADD COLUMN "slug" TEXT,
ADD COLUMN "userId" TEXT;

INSERT INTO "User" ("id", "name", "email", "passwordHash", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  COALESCE("name", split_part("email", '@', 1), 'user'),
  "email",
  "passwordHash",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Profile"
WHERE "email" IS NOT NULL
ON CONFLICT ("email") DO NOTHING;

UPDATE "Profile" p
SET "userId" = u."id"
FROM "User" u
WHERE p."email" = u."email"
  AND p."userId" IS NULL;

UPDATE "Profile"
SET "slug" = LOWER(REGEXP_REPLACE(COALESCE("name", "id"), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTRING("id" FROM 1 FOR 6)
WHERE "slug" IS NULL;

ALTER TABLE "Profile"
ALTER COLUMN "slug" SET NOT NULL;

ALTER TABLE "Profile"
ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "Profile" DROP CONSTRAINT IF EXISTS "Profile_email_key";
ALTER TABLE "Profile" DROP COLUMN IF EXISTS "passwordHash";

CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

ALTER TABLE "Profile"
ADD CONSTRAINT "Profile_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
