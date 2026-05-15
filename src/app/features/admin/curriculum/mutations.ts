import { db } from "@/app/core/db/prisma";

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

  const buf = Buffer.from(await file.arrayBuffer());
  if (!looksLikePdf(buf)) {
    return { ok: false, status: 400, error: "O ficheiro não parece um PDF válido." };
  }

  const updated = await db.profile.update({
    where: { id: profileId },
    data: {
      curriculumPdf: buf,
      curriculumMime: mime,
      hasStoredCurriculum: true,
      curriculum: null,
    },
  });

  const curriculumHref = `/api/curriculum/${updated.id}?v=${updated.updatedAt.getTime()}`;

  return {
    ok: true,
    data: {
      ok: true as const,
      curriculumHref,
      updatedAt: updated.updatedAt.toISOString(),
    },
  };
}

export async function deleteAccountCurriculum(
  profileId: string,
): Promise<{ ok: true; data: { ok: true } }> {
  await db.profile.update({
    where: { id: profileId },
    data: {
      curriculumPdf: null,
      curriculumMime: null,
      hasStoredCurriculum: false,
    },
  });

  return { ok: true, data: { ok: true as const } };
}
