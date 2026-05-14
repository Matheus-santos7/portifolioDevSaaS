-- Primeiro acesso: usuário escolhe o slug público antes de usar o painel completo.
ALTER TABLE "Profile" ADD COLUMN "slugOnboardingDone" BOOLEAN NOT NULL DEFAULT true;
UPDATE "Profile" SET "slugOnboardingDone" = true;
