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

/** Store Blob **Private** — hostname `*.private.blob.vercel-storage.com`. */
export function isPrivateVercelBlobUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(VERCEL_BLOB_PRIVATE_HOST_SUFFIX)
    );
  } catch {
    return false;
  }
}

/**
 * Usar em `<Image unoptimized={...} />`: o otimizador do Next na Vercel pede a URL sem credenciais
 * e recebe `OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED` em Blobs private.
 */
export function nextImageUnoptimized(src: string): boolean {
  return src.startsWith("blob:") || isPrivateVercelBlobUrl(src);
}
