import { del, put } from "@vercel/blob";

import { isVercelBlobUrl } from "@/app/lib/storage/blob-url";

export function isBlobStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function mimeToFileExtension(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

/** Upload público genérico (imagem, PDF, etc.). */
export async function uploadPublicBlob(
  pathname: string,
  file: Blob,
  contentType: string,
): Promise<{ url: string }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN em falta.");
  }
  const blob = await put(pathname, file, {
    access: "public",
    contentType,
    addRandomSuffix: true,
    token,
  });
  return { url: blob.url };
}

/** Envia imagem para o Vercel Blob (acesso público). */
export async function uploadPublicImage(
  pathname: string,
  file: Blob,
  contentType: string,
): Promise<{ url: string }> {
  return uploadPublicBlob(pathname, file, contentType);
}

/** Remove blob anterior se a URL for do Vercel Blob. */
export async function deleteBlobUrlIfStored(url: string | null | undefined): Promise<void> {
  if (!isVercelBlobUrl(url)) return;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return;
  try {
    await del(url!, { token });
  } catch {
    // Objeto já removido ou indisponível — não bloquear o fluxo.
  }
}
