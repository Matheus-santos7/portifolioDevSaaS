-- Catálogo Technology + Skill.technologyId (FK).
-- Idempotente: seguro se "Technology" já existir (ex.: db push) ou se esta migração for reaplicada
-- após `prisma migrate resolve --rolled-back 20260509203000_technology_catalog_skill_fk`.

CREATE TABLE IF NOT EXISTS "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Technology_nameKey_key" ON "Technology"("nameKey");

INSERT INTO "Technology" ("id", "name", "nameKey", "createdAt")
SELECT gen_random_uuid()::text, v.n, v.k, CURRENT_TIMESTAMP
FROM (
    VALUES
        ('React', 'react'),
        ('Next.js', 'next.js'),
        ('TypeScript', 'typescript'),
        ('JavaScript', 'javascript'),
        ('Node.js', 'node.js'),
        ('Python', 'python'),
        ('Prisma', 'prisma'),
        ('PostgreSQL', 'postgresql'),
        ('MySQL', 'mysql'),
        ('MongoDB', 'mongodb'),
        ('Docker', 'docker'),
        ('AWS', 'aws'),
        ('Tailwind CSS', 'tailwind css'),
        ('HTML5', 'html5'),
        ('CSS3', 'css3'),
        ('Git', 'git'),
        ('Figma', 'figma'),
        ('VS Code', 'vs code'),
        ('Linux', 'linux'),
        ('Postman', 'postman'),
        ('Bootstrap', 'bootstrap'),
        ('GraphQL', 'graphql'),
        ('Redis', 'redis'),
        ('Vue', 'vue'),
        ('Angular', 'angular')
) AS v(n, k)
ON CONFLICT ("nameKey") DO NOTHING;

ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "technologyId" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Skill'
      AND column_name = 'name'
  ) THEN
    INSERT INTO "Technology" ("id", "name", "nameKey", "createdAt")
    SELECT gen_random_uuid()::text, sn.name_trim, LOWER(sn.name_trim), CURRENT_TIMESTAMP
    FROM (
      SELECT DISTINCT TRIM("name") AS name_trim
      FROM "Skill"
      WHERE "name" IS NOT NULL AND TRIM("name") <> ''
    ) AS sn
    WHERE NOT EXISTS (SELECT 1 FROM "Technology" t WHERE t."nameKey" = LOWER(sn.name_trim));

    UPDATE "Skill" AS s
    SET "technologyId" = t."id"
    FROM "Technology" AS t
    WHERE s."technologyId" IS NULL
      AND s."name" IS NOT NULL
      AND t."nameKey" = LOWER(TRIM(s."name"));
  END IF;
END $$;

DELETE FROM "Skill"
WHERE "profileId" IS NULL OR "technologyId" IS NULL;

DELETE FROM "Skill" s WHERE NOT EXISTS (SELECT 1 FROM "Profile" p WHERE p.id = s."profileId");

DELETE FROM "Skill" AS sk1
    USING "Skill" AS sk2
WHERE sk1."id" > sk2."id"
    AND sk1."profileId" = sk2."profileId"
    AND sk1."technologyId" = sk2."technologyId";

ALTER TABLE "Skill" DROP CONSTRAINT IF EXISTS "Skill_profileId_fkey";

ALTER TABLE "Skill" DROP COLUMN IF EXISTS "name";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Skill'
      AND column_name = 'technologyId' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE "Skill" ALTER COLUMN "technologyId" SET NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Skill'
      AND column_name = 'profileId' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE "Skill" ALTER COLUMN "profileId" SET NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Skill_technologyId_fkey'
  ) THEN
    ALTER TABLE "Skill" ADD CONSTRAINT "Skill_technologyId_fkey"
      FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Skill_profileId_fkey'
  ) THEN
    ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey"
      FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "Skill_profileId_technologyId_key" ON "Skill"("profileId", "technologyId");

CREATE INDEX IF NOT EXISTS "Skill_profileId_idx" ON "Skill"("profileId");

CREATE INDEX IF NOT EXISTS "Skill_technologyId_idx" ON "Skill"("technologyId");
