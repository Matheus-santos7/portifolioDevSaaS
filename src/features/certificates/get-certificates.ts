import { db } from "@/core/db/prisma";

export async function getCertificates(profileId?: string) {
  return await db.certificate.findMany({
    where: profileId ? { profileId } : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });
}
