import { db } from "@/app/core/db/prisma";

/** Lista certificados do perfil (mesma ordenação em portfólio e API de conta). */
export async function getCertificates(profileId?: string) {
  return db.certificate.findMany({
    where: profileId ? { profileId } : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });
}
