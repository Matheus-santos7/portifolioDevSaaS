import type { Profile } from "@prisma/client";

/** Evita mandar BYTEA grande no JSON das rotas PATCH. */
export function profileWithoutSensitiveBlobs(
  profile: Profile,
): Omit<Profile, "avatarImage" | "curriculumPdf"> {
  const { avatarImage, curriculumPdf, ...rest } = profile;
  void avatarImage;
  void curriculumPdf;
  return rest;
}
