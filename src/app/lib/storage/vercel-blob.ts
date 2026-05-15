import { del, put } from "@vercel/blob";

import { isVercelBlobUrl } from "@/app/lib/storage/blob-url";

/** Token RW: nome padrão Vercel + fallbacks se o prefixo foi alterado no dashboard. */
export function getBlobReadWriteToken(): string {
  return (
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN?.trim() ||
    ""
  );
}

export function isBlobStorageConfigured(): boolean {
  return Boolean(getBlobReadWriteToken());
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

type BlobAccess = "public" | "private";

function blobPutAccessFromEnv(): BlobAccess | null {
  const raw = process.env.BLOB_PUT_ACCESS?.trim().toLowerCase();
  if (raw === "public" || raw === "private") return raw;
  return null;
}

/**
 * Upload com `put`. Stores **Private** na Vercel rejeitam por vezes `access: 'public'`
 * (Access denied). Ordem: env `BLOB_PUT_ACCESS` → `public` → em caso de access denied, `private`.
 */
export async function uploadPublicBlob(
  pathname: string,
  file: Blob,
  contentType: string,
): Promise<{ url: string }> {
  const token = getBlobReadWriteToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN em falta.");
  }

  const fromEnv = blobPutAccessFromEnv();
  const attempts: BlobAccess[] = fromEnv
    ? [fromEnv]
    : ["public", "private"];

  let lastErr: unknown;
  for (const access of attempts) {
    try {
      // SDK types só expõem `public`; stores Private aceitam `private` em runtime.
      const blob = await put(pathname, file, {
        access: access as "public",
        contentType,
        addRandomSuffix: true,
        token,
      });
      return { url: blob.url };
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      const canRetryWithPrivate =
        /access denied|valid token/i.test(msg) &&
        access === "public" &&
        !fromEnv;
      if (canRetryWithPrivate) {
        continue;
      }
      throw e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/** Envia imagem para o Vercel Blob (acesso público ou privado conforme store). */
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
  const token = getBlobReadWriteToken();
  if (!token) return;
  try {
    await del(url!, { token });
  } catch {
    // Objeto já removido ou indisponível — não bloquear o fluxo.
  }
}
