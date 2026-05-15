-- Enum CertificateKind + coluna Certificate.kind
-- Idempotente: seguro se o tipo já existir (ex.: drift / db push).

DO $$ BEGIN
    CREATE TYPE "CertificateKind" AS ENUM (
        'GRADUATION',
        'POST_GRADUATION',
        'EXTENSION',
        'COURSE',
        'CERTIFICATION',
        'WORKSHOP',
        'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "kind" "CertificateKind" NOT NULL DEFAULT 'CERTIFICATION';
