"use client";

import { Code, ExternalLink, GithubIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  cardIconAccentClassForStableId,
  cardInteractiveAccentClassForStableId,
  cardMutedBorderClassForStableId,
  cardSurfaceClassForStableId,
} from "@/app/features/_components/certificates/ui";
import ScrollRevealWrapper from "@/app/features/_components/ui/ScrollRevealWrapper";
import { nextImageUnoptimized } from "@/app/lib/storage/blob-url";

interface ProjectDetailsProps {
  /** Define o tom do cartão (mesma paleta dos certificados). */
  id: string;
  name?: string;
  description?: string;
  type?: string;
  backgroundCover?: string;
  repositorio?: string;
  linkView?: string;
  /** Impede o clique de subir ao cartão (modo edição: links continuam a funcionar). */
  linkStopPropagation?: boolean;
}

const ProjectDetails = ({
  id,
  name,
  description,
  backgroundCover,
  repositorio,
  linkView,
  linkStopPropagation,
}: ProjectDetailsProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ScrollRevealWrapper
      className="project-card"
      options={{ origin: "bottom", delay: 500 }}
    >
      <div
        className={`project-card rounded-xl p-4 shadow-md transition-shadow hover:shadow-lg ${cardSurfaceClassForStableId(id)}`}
      >
        {/* Imagem com ícone sobreposto */}
        <div className="relative mb-4">
          <div
            className={`relative h-60 w-full overflow-hidden rounded-xl border-2 bg-gray-200/90 p-2 dark:bg-gray-800/90 ${cardMutedBorderClassForStableId(id)}`}
          >
            {backgroundCover ? (
              <Image
                src={backgroundCover}
                alt={`Imagem do projeto ${name}`}
                fill
                className="rounded-lg object-center"
                unoptimized={nextImageUnoptimized(backgroundCover)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-gray-500 dark:text-gray-300">
                  Imagem não disponível
                </p>
              </div>
            )}

            {/* Ícone no canto superior direito */}
            <div className="absolute right-2 top-2 rounded-full bg-white/95 p-1 shadow-md ring-1 ring-black/5 dark:bg-gray-950/90 dark:ring-white/10">
              <Code className={`h-5 w-5 ${cardIconAccentClassForStableId(id)}`} />
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <h3
          className={`border-b pb-4 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100 sm:pb-5 ${cardMutedBorderClassForStableId(id)}`}
        >
          {name}
        </h3>
        <div
          className="relative mt-3 sm:mt-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p
            className={`mb-4 line-clamp-3 h-16 text-sm text-gray-600 transition-opacity duration-200 dark:text-gray-400 ${isHovered ? "opacity-30" : "opacity-100"}`}
          >
            {description}
          </p>
          {isHovered && (
            <div className="absolute z-10 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Botões */}
        <div
          className={`mt-2 flex justify-between gap-4 border-t pt-4 ${cardMutedBorderClassForStableId(id)}`}
        >
          <a
            href={repositorio}
            target="_blank"
            rel="noopener noreferrer"
            onClick={linkStopPropagation ? (e) => e.stopPropagation() : undefined}
            className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium ${cardInteractiveAccentClassForStableId(id)}`}
          >
            <GithubIcon className="h-4 w-4 shrink-0" />
            GitHub
          </a>

          <a
            href={linkView}
            target="_blank"
            rel="noopener noreferrer"
            onClick={linkStopPropagation ? (e) => e.stopPropagation() : undefined}
            className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium ${cardInteractiveAccentClassForStableId(id)}`}
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Acessar Projeto
          </a>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
};

export default ProjectDetails;
