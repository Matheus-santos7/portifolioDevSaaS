CREATE TYPE "public"."DegreeKind" AS ENUM ('GRADUATION', 'POST_GRADUATION');

ALTER TABLE "public"."Profile"
ADD COLUMN "degreeKind" "public"."DegreeKind" NOT NULL DEFAULT 'POST_GRADUATION';

ALTER TABLE "public"."Profile"
ADD COLUMN "degreeHighlight" TEXT NOT NULL DEFAULT '';
