"use client";

import type { ReactNode } from "react";

import GenericCarousel from "@/core/ui/GenericCarousel";
import type { ProjectCarouselItem } from "@/features/projects/components/project-carousel-types";
import ProjectDetails from "@/features/projects/components/ProjectDetails";

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
