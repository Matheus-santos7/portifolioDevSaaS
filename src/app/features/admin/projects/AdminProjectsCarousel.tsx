"use client";

import type { ReactNode } from "react";

import type { ProjectCarouselItem } from "@/app/features/_components/projects/project-carousel-types";
import ProjectDetails from "@/app/features/_components/projects/ProjectDetails";
import GenericCarousel from "@/app/features/_components/ui/GenericCarousel";

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
