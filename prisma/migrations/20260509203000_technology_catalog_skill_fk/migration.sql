-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Technology_nameKey_key" ON "Technology"("nameKey");

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
) AS v(n, k);

ALTER TABLE "Skill" ADD COLUMN "technologyId" TEXT;

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

DELETE FROM "Skill"
WHERE "profileId" IS NULL OR "technologyId" IS NULL;

DELETE FROM "Skill" s WHERE NOT EXISTS (SELECT 1 FROM "Profile" p WHERE p.id = s."profileId");

DELETE FROM "Skill" AS sk1
    USING "Skill" AS sk2
WHERE sk1."id" > sk2."id"
    AND sk1."profileId" = sk2."profileId"
    AND sk1."technologyId" = sk2."technologyId";

ALTER TABLE "Skill" DROP CONSTRAINT IF EXISTS "Skill_profileId_fkey";

ALTER TABLE "Skill" DROP COLUMN "name";

ALTER TABLE "Skill" ALTER COLUMN "technologyId" SET NOT NULL;
ALTER TABLE "Skill" ALTER COLUMN "profileId" SET NOT NULL;

ALTER TABLE "Skill" ADD CONSTRAINT "Skill_technologyId_fkey"
    FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey"
    FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Skill_profileId_technologyId_key" ON "Skill"("profileId", "technologyId");
CREATE INDEX "Skill_profileId_idx" ON "Skill"("profileId");
CREATE INDEX "Skill_technologyId_idx" ON "Skill"("technologyId");
