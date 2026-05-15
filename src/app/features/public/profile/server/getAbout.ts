import { db } from "@/app/core/db/prisma";
import { getEducation } from "@/app/features/public/profile/server/getEducation";
import type { AboutSectionViewModel } from "@/app/features/public/profile/server/profileTypes";
import { resolveProfileAvatarSrc } from "@/app/features/public/profile/server/resolve-profile-avatar-src";

export async function getAboutSectionData(profileId: string) {
  const profile = await db.profile.findUnique({
    where: { id: profileId },
    omit: { avatarImage: true, curriculumPdf: true },
  });
  const education = await getEducation(profileId);

  if (!profile) return null;

  const data: AboutSectionViewModel = {
    name: profile.name,
    slug: profile.slug,
    bio: profile.bio,
    displayAvatarSrc: resolveProfileAvatarSrc(profile),
    degreeKind: profile.degreeKind,
    degreeHighlight: profile.degreeHighlight,
    currentSector: profile.currentSector,
    targetSector: profile.targetSector,
    educationStatus: education?.status,
    educationCourse: education?.course,
  };

  return data;
}
