import { del, put } from "@vercel/blob";

import { isVercelBlobUrl } from "@/app/lib/storage/blob-url";

function trimEnv(name: "BLOB_READ_WRITE_TOKEN" | "VERCEL_BLOB_READ_WRITE_TOKEN"): string {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Token Read/Write do Blob.
 * - Prioriza valores com prefixo `vercel_blob_rw_` (evita placeholder errado em
 *   `BLOB_READ_WRITE_TOKEN` quando o token real está em `VERCEL_BLOB_READ_WRITE_TOKEN`).
 * - Se uma variável tiver só token **read-only** (`vercel_blob_ro_`), usa a outra quando possível.
 */
export function getBlobReadWriteToken(): string {
  const blob = trimEnv("BLOB_READ_WRITE_TOKEN");
  const vercel = trimEnv("VERCEL_BLOB_READ_WRITE_TOKEN");

  if (blob.startsWith("vercel_blob_rw_")) return blob;
  if (vercel.startsWith("vercel_blob_rw_")) return vercel;

  const roBlob = blob.startsWith("vercel_blob_ro_");
  const roVercel = vercel.startsWith("vercel_blob_ro_");
  if (roBlob && vercel && !roVercel) return vercel;
  if (roVercel && blob && !roBlob) return blob;

  // Placeholder curto em BLOB_* não deve sobrepor um token longo na outra env
  const looksPlaceholder = (t: string) =>
    t.length > 0 && t.length < 32 && !t.startsWith("vercel_blob_");
  if (looksPlaceholder(blob) && vercel) return vercel;
  if (looksPlaceholder(vercel) && blob) return blob;

  if (blob && vercel) return blob.length >= vercel.length ? blob : vercel;
  return blob || vercel;
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
      throw mapBlobPutAuthError(e);
    }
  }
  throw mapBlobPutAuthError(lastErr ?? new Error("Vercel Blob: falha desconhecida no upload."));
}

function mapBlobPutAuthError(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  if (!/access denied|valid token/i.test(msg)) {
    return err instanceof Error ? err : new Error(msg);
  }
  const t = getBlobReadWriteToken();
  const hint =
    "Confirme no dashboard Vercel (Storage → Blob): token Read/Write (começa por vercel_blob_rw_). " +
    "Se existirem BLOB_READ_WRITE_TOKEN e VERCEL_BLOB_READ_WRITE_TOKEN, remova o valor errado ou deixe só um. " +
    "Token Read-only (vercel_blob_ro_) não serve para upload.";
  if (!t) {
    return new Error(`Vercel Blob: sem token configurado. ${hint}`);
  }
  if (t.startsWith("vercel_blob_ro_")) {
    return new Error(`Vercel Blob: token é read-only. ${hint}`);
  }
  if (!t.startsWith("vercel_blob_rw_")) {
    return new Error(`Vercel Blob: o token não parece um Read/Write válido. ${hint}`);
  }
  return new Error(`${msg} ${hint}`);
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
