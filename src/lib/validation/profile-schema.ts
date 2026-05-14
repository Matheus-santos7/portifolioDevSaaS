import { DegreeKind, type Prisma } from "@prisma/client";

import { isReservedSlug } from "@/lib/slugs/reserved-slugs";
import { toSlug } from "@/lib/slugs/slug";

export type ProfileWriteBody = {
  name?: string;
  bio?: string;
  perfil?: string;
  avatarUrl?: string;
  objectives?: string;
  currentSector?: string;
  targetSector?: string;
  slug?: string;
  clearProfilePhoto?: boolean;
  clearStoredCurriculum?: boolean;
  degreeKind?: string;
  degreeHighlight?: string;
};

type ProfileSchemaError = {
  error: string;
  status: number;
};

type ProfileSchemaResult<T> =
  | { ok: true; value: T }
  | ({ ok: false } & ProfileSchemaError);

type BuildProfileUpdateDataOptions = {
  currentProfileId: string;
  isSlugTaken: (slug: string, currentProfileId: string) => Promise<boolean>;
};

function fail(error: string, status = 400): ProfileSchemaResult<never> {
  return { ok: false, error, status };
}

export async function buildProfileUpdateData(
  body: ProfileWriteBody,
  options: BuildProfileUpdateDataOptions,
): Promise<ProfileSchemaResult<Prisma.ProfileUpdateInput>> {
  const data: Prisma.ProfileUpdateInput = {};

  if (body.clearProfilePhoto === true) {
    data.avatarUrl = null;
    data.avatarImage = null;
    data.avatarMime = null;
    data.hasStoredAvatar = false;
  }

  if (body.clearStoredCurriculum === true) {
    data.curriculumPdf = null;
    data.curriculumMime = null;
    data.hasStoredCurriculum = false;
  }

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.bio === "string") data.bio = body.bio.trim();
  if (typeof body.perfil === "string" && body.perfil.trim()) data.perfil = body.perfil.trim();

  if (typeof body.avatarUrl === "string" && body.clearProfilePhoto !== true) {
    const normalized = body.avatarUrl.trim();

    if (!normalized) {
      data.avatarUrl = null;
    } else if (normalized.startsWith("/api/avatar/")) {
      // Foto armazenada em blob: não sobrescrever com a URL interna.
    } else if (
      normalized.startsWith("/") ||
      normalized.startsWith("http://") ||
      normalized.startsWith("https://")
    ) {
      data.avatarUrl = normalized;
      data.avatarImage = null;
      data.avatarMime = null;
      data.hasStoredAvatar = false;
    } else {
      return fail("Invalid avatar url");
    }
  }

  if (typeof body.objectives === "string") data.objectives = body.objectives.trim();

  if (
    body.degreeKind === DegreeKind.GRADUATION ||
    body.degreeKind === DegreeKind.POST_GRADUATION
  ) {
    data.degreeKind = body.degreeKind;
  }

  if (typeof body.degreeHighlight === "string") {
    data.degreeHighlight = body.degreeHighlight.trim();
  }

  if (typeof body.currentSector === "string" && body.currentSector.trim()) {
    data.currentSector = body.currentSector.trim();
  }

  if (typeof body.targetSector === "string" && body.targetSector.trim()) {
    data.targetSector = body.targetSector.trim();
  }

  if (typeof body.slug === "string" && body.slug.trim()) {
    const slug = toSlug(body.slug);

    if (slug.length < 3 || slug.length > 48) {
      return fail("Invalid slug");
    }

    if (isReservedSlug(slug)) {
      return fail("Reserved slug");
    }

    if (await options.isSlugTaken(slug, options.currentProfileId)) {
      return fail("Slug in use", 409);
    }

    data.slug = slug;
  }

  if (Object.keys(data).length === 0) {
    return fail("Invalid payload");
  }

  return { ok: true, value: data };
}
