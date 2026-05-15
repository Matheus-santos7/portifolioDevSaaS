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

/** Caminho da rota que faz proxy de blobs private com o token no servidor. */
export const BLOB_VIEW_API_PATH = "/api/blob/view";

/**
 * URLs **private** do Vercel Blob não são legíveis no browser sem credenciais.
 * Reescreve para o proxy interno; URLs públicas e caminhos locais mantêm-se.
 */
export function proxiedBlobSrcForPublicRead(absoluteOrPathUrl: string): string {
  if (!isPrivateVercelBlobUrl(absoluteOrPathUrl)) return absoluteOrPathUrl;
  return `${BLOB_VIEW_API_PATH}?u=${encodeURIComponent(absoluteOrPathUrl)}`;
}

/**
 * Usar em `<Image unoptimized={...} />`: o otimizador do Next na Vercel não autentica Blobs private;
 * rotas `/api/blob/view` devolvem bytes já autorizados no servidor.
 */
export function nextImageUnoptimized(src: string): boolean {
  return (
    src.startsWith("blob:") ||
    isPrivateVercelBlobUrl(src) ||
    src.startsWith(`${BLOB_VIEW_API_PATH}?`)
  );
}
