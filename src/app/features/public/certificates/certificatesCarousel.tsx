"use client";

import type { ReactNode } from "react";

import type { CertificateCarouselItem } from "@/app/features/_components/certificates/certificate-carousel-types";
import CertificateDetails from "@/app/features/_components/certificates/CertificateDetails";
import GenericCarousel from "@/app/features/_components/ui/GenericCarousel";

type PublicCertificatesCarouselProps = {
  certificates: CertificateCarouselItem[];
  sectionTitle?: string;
  belowIndicators?: ReactNode;
};

export default function PublicCertificatesCarousel({
  certificates,
  sectionTitle,
  belowIndicators,
}: PublicCertificatesCarouselProps) {
  return (
    <GenericCarousel
      items={certificates}
      sectionTitle={sectionTitle}
      belowIndicators={belowIndicators}
      emptyMessage="Nenhum certificado cadastrado no momento."
      previousButtonLabel="Voltar certificados"
      nextButtonLabel="Avançar certificados"
      centerWhenNotOverflowing
      renderItem={(certificate) => (
        <CertificateDetails
          name={certificate.name}
          kind={certificate.kind}
          endDate={certificate.endDate}
          emitter={certificate.emitter}
          status={certificate.statusLabel}
          link={certificate.link}
        />
      )}
    />
  );
}
