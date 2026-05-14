-- CreateEnum
CREATE TYPE "Category" AS ENUM ('BACKEND', 'FRONTEND', 'UX_UI', 'DEVOPS', 'ANOTATIONS');

-- CreateTable
CREATE TABLE "Recourse" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "deScription" TEXT NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "Recourse_pkey" PRIMARY KEY ("id")
);
