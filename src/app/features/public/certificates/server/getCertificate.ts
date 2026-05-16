import type { CertificateCarouselItem } from "@/app/features/_components/certificates/certificate-carousel-types";
import { formatCertificateStatusLabel } from "@/app/features/_components/certificates/ui";
import { serializeCertificate } from "@/app/features/public/certificates/server/serialize";
import { getCertificates } from "@/app/features/server/certificates";

export async function getCertificatesSectionData(profileId?: string) {
  const certificates = await getCertificates(profileId);
  const serialized = certificates.map(serializeCertificate);
  const carouselCertificates: CertificateCarouselItem[] = serialized.map((certificate) => ({
    id: certificate.id,
    name: certificate.name,
    kind: certificate.kind,
    endDate: certificate.endDate,
    emitter: certificate.emitter,
    statusLabel: formatCertificateStatusLabel(certificate.status),
    link: certificate.link,
  }));

  return {
    serialized,
    carouselCertificates,
  };
}
