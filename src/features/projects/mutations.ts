import { db } from "@/core/db/prisma";
import { projectWithoutCoverBlob } from "@/features/projects/project-public";
import {
  buildProjectUpdateData,
  DEFAULT_PROJECT_BACKGROUND_COVER,
  type ProjectWriteBody,
  validateProjectCreateInput,
} from "@/lib/validation/project-schema";

const MAX_COVER_BYTES = 1024 * 1024;
const ALLOWED_COVER_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type ProjectSerialized = ReturnType<typeof projectWithoutCoverBlob>;

export type AccountProjectMutationError = { ok: false; status: number; error: string };

type Ok<T> = { ok: true; data: T };

export async function createAccountProject(
  profileId: string,
  body: ProjectWriteBody,
): Promise<Ok<ProjectSerialized> | AccountProjectMutationError> {
  const validated = validateProjectCreateInput(body);
  if (!validated.ok) {
    return { ok: false, status: validated.status, error: validated.error };
  }

  const project = await db.project.create({
    data: {
      profileId,
      ...validated.value,
    },
  });

  return { ok: true, data: projectWithoutCoverBlob(project) };
}

export async function updateAccountProject(
  profileId: string,
  projectId: string,
  body: ProjectWriteBody,
): Promise<Ok<ProjectSerialized> | AccountProjectMutationError | { ok: false; status: 404; error: string }> {
  const project = await db.project.findFirst({
    where: { id: projectId, profileId },
  });
  if (!project) {
    return { ok: false, status: 404, error: "Not found" };
  }

  const updateData = buildProjectUpdateData(project, body);
  if (!updateData.ok) {
    return { ok: false, status: updateData.status, error: updateData.error };
  }

  const updated = await db.project.update({
    where: { id: project.id },
    data: updateData.value,
  });

  return { ok: true, data: projectWithoutCoverBlob(updated) };
}

export async function deleteAccountProject(
  profileId: string,
  projectId: string,
): Promise<Ok<{ success: true }> | { ok: false; status: 404; error: string }> {
  const project = await db.project.findFirst({
    where: { id: projectId, profileId },
  });
  if (!project) {
    return { ok: false, status: 404, error: "Not found" };
  }

  await db.project.delete({ where: { id: project.id } });
  return { ok: true, data: { success: true as const } };
}

export async function uploadAccountProjectCover(
  profileId: string,
  projectId: string,
  file: Blob,
): Promise<Ok<ProjectSerialized> | AccountProjectMutationError | { ok: false; status: 404; error: string }> {
  const project = await db.project.findFirst({
    where: { id: projectId, profileId },
  });
  if (!project) {
    return { ok: false, status: 404, error: "Not found" };
  }

  const mime = file.type;
  if (!mime || !ALLOWED_COVER_TYPES.has(mime)) {
    return {
      ok: false,
      status: 400,
      error: "Tipo não permitido. Use JPG, PNG, WebP ou GIF.",
    };
  }

  if (file.size <= 0 || file.size > MAX_COVER_BYTES) {
    return { ok: false, status: 400, error: "Arquivo deve ter até 1 MB." };
  }

  const buf = Buffer.from(await file.arrayBuffer());

  const updated = await db.project.update({
    where: { id: project.id },
    data: {
      coverImage: buf,
      coverMime: mime,
      hasStoredCover: true,
      backgroundCover: DEFAULT_PROJECT_BACKGROUND_COVER,
    },
  });

  return { ok: true, data: projectWithoutCoverBlob(updated) };
}

export async function removeAccountProjectCover(
  profileId: string,
  projectId: string,
): Promise<Ok<ProjectSerialized> | { ok: false; status: 404; error: string }> {
  const project = await db.project.findFirst({
    where: { id: projectId, profileId },
  });
  if (!project) {
    return { ok: false, status: 404, error: "Not found" };
  }

  const updated = await db.project.update({
    where: { id: project.id },
    data: {
      coverImage: null,
      coverMime: null,
      hasStoredCover: false,
      backgroundCover: DEFAULT_PROJECT_BACKGROUND_COVER,
    },
  });

  return { ok: true, data: projectWithoutCoverBlob(updated) };
}
