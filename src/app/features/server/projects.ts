import type { Prisma } from "@prisma/client";

import { db } from "@/app/core/db/prisma";

const projectPublicSelect = {
  id: true,
  name: true,
  description: true,
  backgroundCover: true,
  repositorio: true,
  linkView: true,
  profileId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect;

export type ProjectPublic = Prisma.ProjectGetPayload<{
  select: typeof projectPublicSelect;
}>;

export async function getProject(profileId?: string) {
  return db.project.findMany({
    where: profileId ? { profileId } : undefined,
    orderBy: { createdAt: "desc" },
    select: projectPublicSelect,
  });
}
