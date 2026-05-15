import { db } from "@/app/core/db/prisma";

export async function getEducation(profileId?: string) {
  return await db.education.findFirst({
    where: profileId ? { profileId } : undefined,
    orderBy: { startDate: "desc" },
  });
}
