"use client";

import type { CertificateKind } from "@prisma/client";
import { Award, Calendar, Clock, ExternalLink } from "lucide-react";

import ScrollRevealWrapper from "@/core/ui/ScrollRevealWrapper";
import {
  certificateKindBadgeClass,
  certificateKindCardSurfaceClass,
  certificateKindIconClass,
  certificateKindMutedBorderClass,
  formatCertificateKindLabel,
} from "@/features/certificates/ui";

interface CertificateDetailsProps {
  name: string;
  kind: CertificateKind;
  /** Ausente para itens ainda em andamento sem data. */
  endDate?: Date | string | null;
  emitter: string;
  status: string;
  link: string;
  /** Impede o clique de subir ao cartão (modo edição: o link externo continua a funcionar). */
  linkStopPropagation?: boolean;
}

const CertificateDetails = ({
  name,
  kind,
  endDate,
  emitter,
  status,
  link,
  linkStopPropagation,
}: CertificateDetailsProps) => {
  const hasIssueDate = endDate != null && String(endDate).trim() !== "";
  const formattedDate = hasIssueDate
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(endDate as string))
    : null;

  return (
    <ScrollRevealWrapper
      className="certificate-card flex h-full min-h-0 flex-1 flex-col"
      options={{ origin: "bottom", delay: 500 }}
    >
      <div
        className={`certificate-card flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-lg p-3 shadow-md transition-shadow hover:shadow-lg sm:p-4 ${certificateKindCardSurfaceClass(kind)}`}
      >
        <div className="mb-1.5 flex shrink-0 items-center justify-between gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium leading-none sm:text-xs ${certificateKindBadgeClass(kind)}`}
          >
            {formatCertificateKindLabel(kind)}
          </span>
          <Award
            className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${certificateKindIconClass(kind)}`}
            aria-hidden
          />
        </div>

        <h3
          className={`line-clamp-2 border-b pb-4 text-sm font-semibold leading-tight text-gray-900 dark:text-gray-100 sm:text-base sm:pb-5 ${certificateKindMutedBorderClass(kind)}`}
        >
          {name}
        </h3>

        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5 text-[13px] leading-snug text-gray-600 dark:text-gray-400 sm:mt-4 sm:text-sm">
          <div className="flex items-start gap-1.5">
            <Calendar className="mt-px h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
            <span className="min-w-0 break-words">
              {formattedDate ? (
                <>Emitido em: {formattedDate}</>
              ) : (
                <>Emitido em: <span className="text-gray-400">a definir</span></>
              )}
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <Award className="mt-px h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
            <span className="line-clamp-2 min-w-0 break-words">
              Emissor: {emitter}
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <Clock className="mt-px h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
            <span>Status: {status}</span>
          </div>
        </div>

        <div
          className={`mt-auto shrink-0 border-t pt-2 ${certificateKindMutedBorderClass(kind)}`}
        >
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={linkStopPropagation ? (e) => e.stopPropagation() : undefined}
              className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-500 sm:text-sm"
            >
              Visualizar Certificação
              <ExternalLink className="ml-1 h-3.5 w-3.5 shrink-0" aria-hidden />
            </a>
          ) : (
            <span
              className="inline-flex items-center text-xs opacity-0 select-none sm:text-sm"
              aria-hidden
            >
              Visualizar Certificação
              <ExternalLink className="ml-1 h-3.5 w-3.5 shrink-0" aria-hidden />
            </span>
          )}
        </div>
      </div>
    </ScrollRevealWrapper>
  );
};

export default CertificateDetails;
