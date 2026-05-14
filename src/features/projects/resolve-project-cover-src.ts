type ProjectCoverFields = {
  id: string;
  updatedAt: Date;
  backgroundCover: string;
  hasStoredCover: boolean;
  coverMime: string | null;
};

const DEFAULT_COVER = "/images/projects/default-project.png";

/** URL para `<Image src>`: capa na BD (`/api/project-cover/…`) ou caminho/URL legado. */
export function resolveProjectCoverSrc(project: ProjectCoverFields): string {
  if (project.hasStoredCover && project.coverMime?.trim()) {
    return `/api/project-cover/${project.id}?v=${project.updatedAt.getTime()}`;
  }

  const url = project.backgroundCover?.trim();
  if (
    url &&
    (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://"))
  ) {
    return url;
  }

  return DEFAULT_COVER;
}
