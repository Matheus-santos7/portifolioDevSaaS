-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "curriculumPdf" BYTEA,
ADD COLUMN "curriculumMime" TEXT,
ADD COLUMN "hasStoredCurriculum" BOOLEAN NOT NULL DEFAULT false;
