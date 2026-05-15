"use client";

import type { ReactNode } from "react";

import type { ProjectCarouselItem } from "@/app/features/_components/projects/project-carousel-types";
import ProjectDetails from "@/app/features/_components/projects/ProjectDetails";
import GenericCarousel from "@/app/features/_components/ui/GenericCarousel";

type PublicProjectsCarouselProps = {
  projects: ProjectCarouselItem[];
  sectionTitle?: string;
  belowIndicators?: ReactNode;
};

export default function PublicProjectsCarousel({
  projects,
  sectionTitle,
  belowIndicators,
}: PublicProjectsCarouselProps) {
  return (
    <GenericCarousel
      items={projects}
      sectionTitle={sectionTitle}
      belowIndicators={belowIndicators}
      emptyMessage="Nenhum projeto cadastrado no momento."
      previousButtonLabel="Voltar projetos"
      nextButtonLabel="Avançar projetos"
      centerWhenNotOverflowing
      enableSnap
      renderItem={(project) => <ProjectDetails {...project} />}
    />
  );
}
