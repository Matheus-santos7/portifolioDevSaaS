import { getSkills } from "@/app/features/server/skills";

export async function getPublicSkillsSectionData(profileId: string) {
  return {
    skills: await getSkills(profileId),
  };
}
