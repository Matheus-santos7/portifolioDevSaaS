import Link from "next/link";

import CertificatesSection from "@/app/features/_components/certificates/CertificatesSection";
import AboutSection from "@/app/features/_components/profile/AboutSection";
import ProjectsSection from "@/app/features/_components/projects/ProjectsSection";
import SkillsSection from "@/app/features/_components/skills/SkillsSection";
import ContactFooter from "@/app/features/_components/ui/ContactFooter";
import PublicPortfolioHeader from "@/app/features/_components/ui/PublicPortfolioHeader";
import PublicCertificatesCarousel from "@/app/features/public/certificates/certificatesCarousel";
import PublicAboutSectionClient from "@/app/features/public/profile/PublicAboutSectionClient";
import { getProfile } from "@/app/features/public/profile/server/queries";
import { resolveCurriculumHref } from "@/app/features/public/profile/server/urls";
import PublicProjectsCarousel from "@/app/features/public/projects/PublicProjectsCarousel";
import { getPublicSkillsSectionData } from "@/app/features/public/skills/server/getPublicSkillsSectionData";
import SkillsPillsClient from "@/app/features/public/skills/SkillsPillsClient";
import { AppBackground } from "@/app/layout/AppBackground";
import { getSession } from "@/app/lib/auth/session";

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
        <ContactFooter profileId={profile.id} />
      </footer>
    </AppBackground>
  );
}
