import { db } from "@/core/db/prisma";
import { ContactFooter } from "@/features/portfolio/components/ContactFooter";
import { getProfile } from "@/features/profile/get-profile";
import { resolveCurriculumHref } from "@/features/profile/resolve-curriculum-href";

type ContactFooterSectionProps = {
  profileId?: string;
};

export default async function ContactFooterSection({
  profileId,
}: ContactFooterSectionProps = {}) {
  const profile = profileId
    ? await db.profile.findUnique({
        where: { id: profileId },
        omit: { avatarImage: true, curriculumPdf: true },
      })
    : await getProfile();

  if (!profile) return null;

  const curriculumHref = resolveCurriculumHref(profile);

  return (
    <ContactFooter
      name={profile.name}
      email={profile.email ?? ""}
      phone={profile.phone ?? ""}
      linkedin={profile.linkedin ?? ""}
      instagram={profile.instagram ?? ""}
      curriculumHref={curriculumHref}
    />
  );
}
