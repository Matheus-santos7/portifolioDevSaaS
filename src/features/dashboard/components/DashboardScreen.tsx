import { redirect } from "next/navigation";

import { AppBackground } from "@/app/layout/AppBackground";
import CertificatesEditorClient from "@/features/certificates/components/CertificatesEditorClient";
import CertificatesSection from "@/features/certificates/components/CertificatesSection";
import { CurriculumManager } from "@/features/curriculum/components/CurriculumManager";
import AdminDashboardHeader from "@/features/dashboard/components/AdminDashboardHeader";
import ContactFooterSection from "@/features/portfolio/components/ContactFooterSection";
import AboutSection from "@/features/profile/components/AboutSection";
import AdminAboutSectionClient from "@/features/profile/components/AdminAboutSectionClient";
import { resolveCurriculumHref } from "@/features/profile/resolve-curriculum-href";
import ProjectsEditorClient from "@/features/projects/components/ProjectsEditorClient";
import ProjectsSection from "@/features/projects/components/ProjectsSection";
import SkillsEditorClient from "@/features/skills/components/SkillsEditorClient";
import SkillsSection from "@/features/skills/components/SkillsSection";
import { getAdminSkillsSectionData } from "@/features/skills/getSkillsSectionData";
import { requireCurrentProfile } from "@/lib/auth/current-profile";

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
          <CurriculumManager
            profileId={profileId}
            slug={profile.slug}
            hasStoredCurriculum={profile.hasStoredCurriculum}
            updatedAt={profile.updatedAt.toISOString()}
          />
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
        <ContactFooterSection profileId={profileId} />
      </footer>
    </AppBackground>
  );
}
