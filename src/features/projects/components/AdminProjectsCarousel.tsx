"use client";

import type { ReactNode } from "react";

import GenericCarousel from "@/core/ui/GenericCarousel";
import type { ProjectCarouselItem } from "@/features/projects/components/project-carousel-types";
import ProjectDetails from "@/features/projects/components/ProjectDetails";

type AdminProjectsCarouselProps = {
  projects: ProjectCarouselItem[];
  sectionTitle?: string;
  belowIndicators?: ReactNode;
  onProjectClick: (project: ProjectCarouselItem) => void;
};

export default function AdminProjectsCarousel({
  projects,
  sectionTitle,
  belowIndicators,
  onProjectClick,
}: AdminProjectsCarouselProps) {
  return (
    <GenericCarousel
      items={projects}
      sectionTitle={sectionTitle}
      belowIndicators={belowIndicators}
      emptyMessage="Nenhum projeto cadastrado no momento."
      previousButtonLabel="Voltar projetos"
      nextButtonLabel="Avançar projetos"
      enableSnap
      onItemClick={onProjectClick}
      renderItem={(project) => <ProjectDetails {...project} linkStopPropagation />}
    />
  );
}
