const VERCEL_BLOB_PUBLIC_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** URL pública do Vercel Blob (ex.: `https://….public.blob.vercel-storage.com/…`). */
export function isVercelBlobUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(VERCEL_BLOB_PUBLIC_HOST_SUFFIX)
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
