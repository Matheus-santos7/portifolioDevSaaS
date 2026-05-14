import { db } from "@/core/db/prisma";
import { profileWithoutSensitiveBlobs } from "@/features/profile/profile-response";
import {
  buildProfileUpdateData,
  type ProfileWriteBody,
} from "@/lib/validation/profile-schema";

type ProfileSerialized = ReturnType<typeof profileWithoutSensitiveBlobs>;

export async function patchAccountProfile(
  profileId: string,
  body: ProfileWriteBody,
): Promise<{ ok: true; data: ProfileSerialized } | { ok: false; status: number; error: string }> {
  const updateData = await buildProfileUpdateData(body, {
    currentProfileId: profileId,
    isSlugTaken: async (slug, currentProfileId) => {
      const taken = await db.profile.findFirst({
        where: { slug, NOT: { id: currentProfileId } },
        select: { id: true },
      });
      return Boolean(taken);
    },
  });
  if (!updateData.ok) {
    return { ok: false, status: updateData.status, error: updateData.error };
  }

  const updated = await db.profile.update({
    where: { id: profileId },
    data: updateData.value,
  });

  return { ok: true, data: profileWithoutSensitiveBlobs(updated) };
}

const AVATAR_MAX_BYTES = 512 * 1024;
const AVATAR_ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function uploadAccountAvatar(
  profileId: string,
  file: Blob,
): Promise<{ ok: true; data: { avatarUrl: string } } | { ok: false; status: number; error: string }> {
  const mime = file.type;
  if (!mime || !AVATAR_ALLOWED_TYPES.has(mime)) {
    return {
      ok: false,
      status: 400,
      error: "Tipo nao permitido. Use JPG, PNG, WebP ou GIF.",
    };
  }

  if (file.size <= 0 || file.size > AVATAR_MAX_BYTES) {
    return { ok: false, status: 400, error: "Arquivo deve ter ate 512 KB." };
  }

  const buf = Buffer.from(await file.arrayBuffer());

  const updated = await db.profile.update({
    where: { id: profileId },
    data: {
      avatarImage: buf,
      avatarMime: mime,
      hasStoredAvatar: true,
      avatarUrl: null,
    },
  });

  const avatarUrl = `/api/avatar/${updated.id}?v=${updated.updatedAt.getTime()}`;
  return { ok: true, data: { avatarUrl } };
}
