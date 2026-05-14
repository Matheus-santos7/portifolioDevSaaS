import Link from "next/link";

import { AppBackground } from "@/app/layout/AppBackground";
import CertificatesSection from "@/features/certificates/components/CertificatesSection";
import PublicCertificatesCarousel from "@/features/certificates/components/PublicCertificatesCarousel";
import ContactFooterSection from "@/features/portfolio/components/ContactFooterSection";
import PublicPortfolioHeader from "@/features/portfolio/components/PublicPortfolioHeader";
import AboutSection from "@/features/profile/components/AboutSection";
import PublicAboutSectionClient from "@/features/profile/components/PublicAboutSectionClient";
import { getProfile } from "@/features/profile/get-profile";
import { resolveCurriculumHref } from "@/features/profile/resolve-curriculum-href";
import ProjectsSection from "@/features/projects/components/ProjectsSection";
import PublicProjectsCarousel from "@/features/projects/components/PublicProjectsCarousel";
import SkillsPillsClient from "@/features/skills/components/SkillsPillsClient";
import SkillsSection from "@/features/skills/components/SkillsSection";
import { getPublicSkillsSectionData } from "@/features/skills/getSkillsSectionData";
import { getSession } from "@/lib/auth/session";

type PublicPortfolioScreenProps = {
  slug: string;
};

export default async function PublicPortfolioScreen({
  slug,
}: PublicPortfolioScreenProps) {
  const profile = await getProfile(slug);

  if (!profile) {
    return (
      <AppBackground isDarkMode={true}>
        <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Perfil não encontrado</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Confira o link ou volte para a página inicial.
          </p>
          <Link
            href="/"
            className="mt-8 text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400"
          >
            Página inicial
          </Link>
        </main>
      </AppBackground>
    );
  }

  const session = await getSession();
  const curriculumHref = resolveCurriculumHref(profile);

  return (
    <AppBackground isDarkMode={true}>
      <PublicPortfolioHeader
        bracketLabel={profile.name}
        isAuthenticated={Boolean(session)}
        curriculumHref={curriculumHref}
        phone={profile.phone}
      />

      <main>
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
          <AboutSection profileId={profile.id} View={PublicAboutSectionClient} />
          <SkillsSection
            profileId={profile.id}
            sectionId="habilidades"
            View={SkillsPillsClient}
            loadData={getPublicSkillsSectionData}
            mapViewProps={(data) => ({
              skills: data.skills,
            })}
          />
          <ProjectsSection
            profileId={profile.id}
            sectionId="projetos"
            View={PublicProjectsCarousel}
            mapViewProps={(data) => ({
              projects: data.carouselProjects,
              sectionTitle: "Meus Projetos",
            })}
          />
        </div>

        <section
          id="certificados"
          className="scroll-mt-24 w-full border-t border-gray-200/80 dark:border-gray-800/80"
          aria-label="Certificados do portfolio"
        >
          <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
            <CertificatesSection
              profileId={profile.id}
              View={PublicCertificatesCarousel}
              mapViewProps={(data) => ({
                certificates: data.carouselCertificates,
                sectionTitle: "Meus Certificados",
              })}
            />
          </div>
        </section>
      </main>

      <footer id="contato">
        <ContactFooterSection profileId={profile.id} />
      </footer>
    </AppBackground>
  );
}
