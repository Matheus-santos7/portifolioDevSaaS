import type { Skill, Technology } from "@prisma/client";

import { db } from "@/app/core/db/prisma";

export type SkillWithTechnology = Skill & { technology: Technology };

export async function getSkills(profileId: string | undefined): Promise<SkillWithTechnology[]> {
  if (!profileId) return [];

  const rows = await db.skill.findMany({
    where: { profileId },
    include: { technology: true },
  });
  return [...rows].sort((a, b) =>
    a.technology.nameKey.localeCompare(b.technology.nameKey, "pt"),
  );
}

export type TechnologyCatalogRow = {
  id: string;
  name: string;
  nameKey: string;
  svgUrl: string | null;
};

export async function getTechnologyCatalog(): Promise<TechnologyCatalogRow[]> {
  return db.technology.findMany({
    orderBy: { nameKey: "asc" },
    select: { id: true, name: true, nameKey: true, svgUrl: true },
  });
}
