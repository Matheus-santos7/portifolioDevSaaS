import type { Prisma, Profile } from "@prisma/client";

import { db } from "@/app/core/db/prisma";
import { isVercelBlobUrl } from "@/app/lib/storage/blob-url";
import {
  deleteBlobUrlIfStored,
  isBlobStorageConfigured,
  mimeToFileExtension,
  uploadPublicImage,
} from "@/app/lib/storage/vercel-blob";
import {
  buildProfileUpdateData,
  type ProfileWriteBody,
} from "@/app/lib/validation/profile-schema";

type ProfileSerialized = Profile;

function nextScalarFromPatch(
  prev: string | null,
  patch: Prisma.ProfileUpdateInput,
  key: "avatarUrl" | "curriculum",
): string | null {
  if (!Object.prototype.hasOwnProperty.call(patch, key)) {
    return prev;
  }
  const raw = patch[key];
  if (raw === undefined) return prev;
  if (raw === null) return null;
  if (typeof raw === "string") return raw;
  return prev;
}

export async function patchAccountProfile(
  profileId: string,
  body: ProfileWriteBody,
): Promise<{ ok: true; data: ProfileSerialized } | { ok: false; status: number; error: string }> {
  const existing = await db.profile.findUnique({
    where: { id: profileId },
    select: { avatarUrl: true, curriculum: true },
  });
  if (!existing) {
    return { ok: false, status: 404, error: "Not found" };
  }

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

  const prevAvatar = existing.avatarUrl ?? null;
  const nextAvatar = nextScalarFromPatch(prevAvatar, updateData.value, "avatarUrl");

  const prevCurriculum = existing.curriculum ?? null;
  const nextCurriculum = nextScalarFromPatch(prevCurriculum, updateData.value, "curriculum");

  if (nextAvatar !== prevAvatar && prevAvatar && isVercelBlobUrl(prevAvatar)) {
    await deleteBlobUrlIfStored(prevAvatar);
  }

  if (nextCurriculum !== prevCurriculum && prevCurriculum && isVercelBlobUrl(prevCurriculum)) {
    await deleteBlobUrlIfStored(prevCurriculum);
  }

  const updated = await db.profile.update({
    where: { id: profileId },
    data: updateData.value,
  });

  return { ok: true, data: updated };
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

  if (!isBlobStorageConfigured()) {
    return {
      ok: false,
      status: 503,
      error: "Armazenamento de imagens não configurado (BLOB_READ_WRITE_TOKEN).",
    };
  }

  const profile = await db.profile.findUnique({
    where: { id: profileId },
    select: { avatarUrl: true },
  });
  if (!profile) {
    return { ok: false, status: 404, error: "Perfil não encontrado." };
  }

  await deleteBlobUrlIfStored(
    isVercelBlobUrl(profile.avatarUrl) ? profile.avatarUrl : null,
  );

  const ext = mimeToFileExtension(mime);
  const pathname = `avatars/${profileId}/avatar.${ext}`;
  const { url } = await uploadPublicImage(pathname, file, mime);

  const updated = await db.profile.update({
    where: { id: profileId },
    data: {
      avatarUrl: url,
    },
  });

  return { ok: true, data: { avatarUrl: updated.avatarUrl ?? url } };
}
