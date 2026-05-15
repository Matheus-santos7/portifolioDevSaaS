import { getProject } from "@/app/features/public/projects/server/get-project";
import { resolveProjectCoverSrc } from "@/app/features/public/projects/server/resolve-project-cover-src";

export async function getProjectsSectionData(profileId?: string) {
  const projects = await getProject(profileId);
  const carouselProjects = projects.map((project) => ({
    ...project,
    backgroundCover: resolveProjectCoverSrc(project),
  }));

  return {
    projects,
    carouselProjects,
  };
}
