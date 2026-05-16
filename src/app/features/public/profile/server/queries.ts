import { db } from "@/app/core/db/prisma";

export async function getProfile(slug?: string) {
  return db.profile.findFirst({
    where: {
      ...(slug ? { slug } : {}),
      isPublic: true,
    },
  });
}

export async function getEducation(profileId?: string) {
  return db.education.findFirst({
    where: profileId ? { profileId } : undefined,
    orderBy: { startDate: "desc" },
  });
}
