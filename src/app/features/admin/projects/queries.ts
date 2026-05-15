import { db } from "@/app/core/db/prisma";

/** Lista projetos da conta (API), ordenados por data. */
export async function listAccountProjectsForApi(profileId: string) {
  return db.project.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
  });
}
