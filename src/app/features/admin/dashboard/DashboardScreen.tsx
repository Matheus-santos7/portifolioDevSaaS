import { redirect } from "next/navigation";

import CertificatesSection from "@/app/features/_components/certificates/CertificatesSection";
import AboutSection from "@/app/features/_components/profile/AboutSection";
import ProjectsSection from "@/app/features/_components/projects/ProjectsSection";
import SkillsSection from "@/app/features/_components/skills/SkillsSection";
import ContactFooter from "@/app/features/_components/ui/ContactFooter";
import CertificatesEditorClient from "@/app/features/admin/certificates/CertificatesEditorClient";
import { CurriculumManager } from "@/app/features/admin/curriculum/CurriculumManager";
import AdminDashboardHeader from "@/app/features/admin/dashboard/AdminDashboardHeader";
import AdminAboutSectionClient from "@/app/features/admin/profile/AdminAboutSectionClient";
import ProjectsEditorClient from "@/app/features/admin/projects/ProjectsEditorClient";
import { getAdminSkillsSectionData } from "@/app/features/admin/skills/server/getAdminSkillsSectionData";
import SkillsEditorClient from "@/app/features/admin/skills/SkillsEditorClient";
import { resolveCurriculumHref } from "@/app/features/public/profile/server/urls";
import { AppBackground } from "@/app/layout/AppBackground";
import { requireCurrentProfile } from "@/app/lib/auth/current-profile";

export default async function DashboardScreen() {
  const profile = await requireCurrentProfile();
  if (!profile.slugOnboardingDone) {
    redirect("/dashboard/setup-slug");
  }

  const profileId = profile.id;

  return (
    <AppBackground isDarkMode={true}>
      <AdminDashboardHeader
        name={profile.name}
        slug={profile.slug}
        curriculumHref={resolveCurriculumHref(profile)}
        phone={profile.phone}
      />

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AboutSection profileId={profileId} View={AdminAboutSectionClient} />
          <CurriculumManager slug={profile.slug} curriculum={profile.curriculum} />
          <SkillsSection
            profileId={profileId}
            View={SkillsEditorClient}
            loadData={getAdminSkillsSectionData}
            mapViewProps={(data) => ({
              catalog: data.catalog,
              skills: data.skills,
              localTechIcons: data.localTechIcons,
            })}
          />
          <ProjectsSection
            profileId={profileId}
            sectionId="projetos"
            View={ProjectsEditorClient}
            mapViewProps={(data) => ({
              initialProjects: data.projects,
              carouselProjects: data.carouselProjects,
            })}
          />
        </div>
        <section className="w-full border-t border-gray-200/80 dark:border-gray-800/80">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <CertificatesSection
              profileId={profileId}
              sectionId="certificados"
              View={CertificatesEditorClient}
              mapViewProps={(data) => ({
                initialCertificates: data.serialized,
                carouselCertificates: data.serialized,
              })}
            />
          </div>
        </section>
      </main>

      <footer>
        <ContactFooter profileId={profileId} />
      </footer>
    </AppBackground>
  );
}
