import { proxiedBlobSrcForPublicRead } from "@/app/lib/storage/blob-url";

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
    const resolved = url.startsWith("https://") ? proxiedBlobSrcForPublicRead(url) : url;
    return resolved;
  }

  return DEFAULT_COVER;
}
