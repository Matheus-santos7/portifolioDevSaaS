import { getProject } from "@/features/projects/get-project";
import { resolveProjectCoverSrc } from "@/features/projects/resolve-project-cover-src";

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
