import { resolveProjectCoverSrc } from "@/app/features/public/projects/server/resolve-project-cover-src";
import { getProject } from "@/app/features/server/projects";

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
