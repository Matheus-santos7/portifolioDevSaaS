type ProjectCoverFields = {
  backgroundCover: string;
};

const DEFAULT_COVER = "/images/projects/default-project.png";

/** URL para `<Image src>`: caminho local ou URL externa (ex.: Vercel Blob). */
export function resolveProjectCoverSrc(project: ProjectCoverFields): string {
  const url = project.backgroundCover?.trim();
  if (
    url &&
    (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://"))
  ) {
    return url;
  }

  return DEFAULT_COVER;
}
