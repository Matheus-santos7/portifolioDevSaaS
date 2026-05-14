/*
  Warnings:

  - You are about to drop the column `deScription` on the `Resources` table. All the data in the column will be lost.
  - Added the required column `description` to the `Resources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resources" DROP COLUMN "deScription",
ADD COLUMN     "description" TEXT NOT NULL;
