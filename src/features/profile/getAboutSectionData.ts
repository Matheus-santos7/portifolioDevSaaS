import { db } from "@/core/db/prisma";
import type { AboutSectionViewModel } from "@/features/profile/about-section-types";
import { getEducation } from "@/features/profile/get-education";
import { resolveProfileAvatarSrc } from "@/features/profile/resolve-profile-avatar-src";

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
