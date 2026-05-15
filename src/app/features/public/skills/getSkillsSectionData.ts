import { getSkills, getTechnologyCatalog } from "@/app/features/public/skills/get-skills";
import { listLocalTechIcons } from "@/app/lib/technologies/local-public-tech-icons";

export async function getPublicSkillsSectionData(profileId: string) {
  return {
    skills: await getSkills(profileId),
  };
}

export async function getAdminSkillsSectionData(profileId: string) {
  const [skills, catalog] = await Promise.all([
    getSkills(profileId),
    getTechnologyCatalog(),
  ]);

  return {
    skills,
    catalog: catalog.map((technology) => ({
      id: technology.id,
      name: technology.name,
      nameKey: technology.nameKey,
      svgUrl: technology.svgUrl,
    })),
    localTechIcons: listLocalTechIcons(),
  };
}
