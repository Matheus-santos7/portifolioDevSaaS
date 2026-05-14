-- AlterTable — data de emissão só obrigatória quando não está «em andamento».
ALTER TABLE "Certificate" ALTER COLUMN "endDate" DROP NOT NULL;
