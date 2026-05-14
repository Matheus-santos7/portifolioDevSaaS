import { db } from "@/core/db/prisma";
import { projectWithoutCoverBlob } from "@/features/projects/project-public";

/** Lista projetos da conta (API), ordenados por data, sem o blob da capa. */
export async function listAccountProjectsForApi(profileId: string) {
  const projects = await db.project.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
  });
  return projects.map(projectWithoutCoverBlob);
}
