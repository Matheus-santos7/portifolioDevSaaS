import { db } from "@/app/core/db/prisma";

export async function getProfile(slug?: string) {
  return db.profile.findFirst({
    where: {
      ...(slug ? { slug } : {}),
      isPublic: true,
    },
    omit: {
      avatarImage: true,
      curriculumPdf: true,
    },
  });
}
