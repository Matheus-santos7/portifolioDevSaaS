import { db } from "@/app/core/db/prisma";
import type { PublicBinaryRouteResult } from "@/app/features/public/profile/server/public-binary-assets";

type ViewerUserId = string | undefined;

/** GET `/api/project-cover/[projectId]` — imagem da capa com a mesma política de acesso. */
export async function getPublicProjectCoverBinary(
  projectId: string,
  viewerUserId: ViewerUserId,
): Promise<PublicBinaryRouteResult> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      coverImage: true,
      coverMime: true,
      profile: { select: { isPublic: true, userId: true } },
    },
  });

  const bytes = project?.coverImage;
  const mime = project?.coverMime?.trim();
  if (!project || !project.profile || !bytes || !bytes.length || !mime) {
    return { status: 404 };
  }

  const canView =
    project.profile.isPublic === true ||
    (viewerUserId !== undefined && viewerUserId === project.profile.userId);

  if (!canView) {
    return { status: 403 };
  }

  const cacheControl =
    project.profile.isPublic === true
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
