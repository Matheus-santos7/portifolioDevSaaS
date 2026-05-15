import { db } from "@/app/core/db/prisma";
import { isVercelBlobUrl } from "@/app/lib/storage/blob-url";
import {
  deleteBlobUrlIfStored,
  isBlobStorageConfigured,
  uploadPublicBlob,
} from "@/app/lib/storage/vercel-blob";

const CURRICULUM_MAX_BYTES = 4 * 1024 * 1024;
const CURRICULUM_ALLOWED_TYPES = new Set(["application/pdf"]);

function looksLikePdf(buf: Buffer) {
  if (buf.length < 5) return false;
  const head = buf.subarray(0, 5).toString("ascii");
  return head === "%PDF-";
}

export async function uploadAccountCurriculum(
  profileId: string,
  file: Blob,
): Promise<
  | {
      ok: true;
      data: { ok: true; curriculumHref: string; updatedAt: string };
    }
  | { ok: false; status: number; error: string }
> {
  const mime = file.type || "application/pdf";
  if (!CURRICULUM_ALLOWED_TYPES.has(mime)) {
    return { ok: false, status: 400, error: "Envie um ficheiro PDF." };
  }

  if (file.size <= 0 || file.size > CURRICULUM_MAX_BYTES) {
    return { ok: false, status: 400, error: "O PDF deve ter no máximo 4 MB." };
  }

  if (!isBlobStorageConfigured()) {
    return {
      ok: false,
      status: 503,
      error: "Armazenamento não configurado (BLOB_READ_WRITE_TOKEN).",
    };
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (!looksLikePdf(buf)) {
    return { ok: false, status: 400, error: "O ficheiro não parece um PDF válido." };
  }

  const existing = await db.profile.findUnique({
    where: { id: profileId },
    select: { curriculum: true },
  });
  if (!existing) {
    return { ok: false, status: 404, error: "Perfil não encontrado." };
  }

  await deleteBlobUrlIfStored(
    existing.curriculum && isVercelBlobUrl(existing.curriculum) ? existing.curriculum : null,
  );

  const pathname = `curricula/${profileId}/cv.pdf`;
  const { url } = await uploadPublicBlob(pathname, file, mime);

  const updated = await db.profile.update({
    where: { id: profileId },
    data: { curriculum: url },
  });

  return {
    ok: true,
    data: {
      ok: true as const,
      curriculumHref: url,
      updatedAt: updated.updatedAt.toISOString(),
    },
  };
}

export async function deleteAccountCurriculum(
  profileId: string,
): Promise<{ ok: true; data: { ok: true } } | { ok: false; status: 404; error: string }> {
  const existing = await db.profile.findUnique({
    where: { id: profileId },
    select: { curriculum: true },
  });
  if (!existing) {
    return { ok: false, status: 404, error: "Perfil não encontrado." };
  }

  await deleteBlobUrlIfStored(
    existing.curriculum && isVercelBlobUrl(existing.curriculum) ? existing.curriculum : null,
  );

  await db.profile.update({
    where: { id: profileId },
    data: { curriculum: null },
  });

  return { ok: true, data: { ok: true as const } };
}
