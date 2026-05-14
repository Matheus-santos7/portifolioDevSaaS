import { getCertificates } from "@/features/certificates/get-certificates";

/** Certificados da conta (API), mesma ordenação e payload que o `findMany` original. */
export async function listAccountCertificatesForApi(profileId: string) {
  return getCertificates(profileId);
}
