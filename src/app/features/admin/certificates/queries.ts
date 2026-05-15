import { getCertificates } from "@/app/features/public/certificates/server/getCertificate";

/** Certificados da conta (API), mesma ordenação e payload que o `findMany` original. */
export async function listAccountCertificatesForApi(profileId: string) {
  return getCertificates(profileId);
}
