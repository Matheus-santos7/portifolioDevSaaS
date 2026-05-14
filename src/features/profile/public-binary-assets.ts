import { db } from "@/core/db/prisma";

type ViewerUserId = string | undefined;

export type PublicBinaryRouteResult =
  | { status: 404 | 403 }
  | {
      status: 200;
      body: Uint8Array;
      headers: Record<string, string>;
    };

/** GET `/api/avatar/[profileId]` — bytes + cabeçalhos (mesma política de acesso e cache). */
export async function getPublicAvatarBinary(
  profileId: string,
  viewerUserId: ViewerUserId,
): Promise<PublicBinaryRouteResult> {
  const profile = await db.profile.findUnique({
    where: { id: profileId },
    select: {
      avatarImage: true,
      avatarMime: true,
      isPublic: true,
      userId: true,
    },
  });

  const bytes = profile?.avatarImage;
  const mime = profile?.avatarMime?.trim();
  if (!profile || !bytes || !bytes.length || !mime) {
    return { status: 404 };
  }

  const canView =
    profile.isPublic || (viewerUserId !== undefined && viewerUserId === profile.userId);

  if (!canView) {
    return { status: 403 };
  }

  const cacheControl = profile.isPublic
    ? "public, max-age=3600, stale-while-revalidate=86400"
    : "private, no-store";

  return {
    status: 200,
    body: new Uint8Array(bytes),
    headers: {
      "Content-Type": mime,
      "Cache-Control": cacheControl,
      Vary: "Cookie",
    },
  };
}

/** GET `/api/curriculum/[profileId]` — PDF inline com os mesmos cabeçalhos. */
export async function getPublicCurriculumBinary(
  profileId: string,
  viewerUserId: ViewerUserId,
): Promise<PublicBinaryRouteResult> {
  const profile = await db.profile.findUnique({
    where: { id: profileId },
    select: {
      curriculumPdf: true,
      curriculumMime: true,
      hasStoredCurriculum: true,
      isPublic: true,
      userId: true,
    },
  });

  const bytes = profile?.curriculumPdf;
  const mime = profile?.curriculumMime?.trim() || "application/pdf";
  if (!profile?.hasStoredCurriculum || !bytes || bytes.length === 0) {
    return { status: 404 };
  }

  const canView =
    profile.isPublic || (viewerUserId !== undefined && viewerUserId === profile.userId);

  if (!canView) {
    return { status: 403 };
  }

  const cacheControl = profile.isPublic
    ? "public, max-age=3600, stale-while-revalidate=86400"
    : "private, no-store";

  return {
    status: 200,
    body: new Uint8Array(bytes),
    headers: {
      "Content-Type": mime,
      "Content-Disposition": 'inline; filename="curriculo.pdf"',
      "Cache-Control": cacheControl,
      Vary: "Cookie",
    },
  };
}
