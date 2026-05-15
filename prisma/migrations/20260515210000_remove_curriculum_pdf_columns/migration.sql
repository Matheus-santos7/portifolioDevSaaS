-- Currículo passa a ser apenas URL (ex.: Vercel Blob); sem BYTEA na BD.

ALTER TABLE "Profile" DROP COLUMN IF EXISTS "curriculumPdf";
ALTER TABLE "Profile" DROP COLUMN IF EXISTS "curriculumMime";
ALTER TABLE "Profile" DROP COLUMN IF EXISTS "hasStoredCurriculum";
