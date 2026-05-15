const VERCEL_BLOB_PUBLIC_HOST_SUFFIX = ".public.blob.vercel-storage.com";
const VERCEL_BLOB_PRIVATE_HOST_SUFFIX = ".private.blob.vercel-storage.com";

/** URL do Vercel Blob (público ou store Private — beta). */
export function isVercelBlobUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:") return false;
    const h = parsed.hostname;
    return (
      h.endsWith(VERCEL_BLOB_PUBLIC_HOST_SUFFIX) || h.endsWith(VERCEL_BLOB_PRIVATE_HOST_SUFFIX)
    );
  } catch {
    return false;
  }
}

/** Capa enviada pelo upload para o Blob (URL guardada em `backgroundCover`). */
export function hasManagedProjectCover(project: { backgroundCover: string }): boolean {
  return isVercelBlobUrl(project.backgroundCover);
}

/** Avatar enviado pelo upload para o Blob. */
export function hasManagedProfileAvatar(profile: { avatarUrl: string | null }): boolean {
  return isVercelBlobUrl(profile.avatarUrl);
}
