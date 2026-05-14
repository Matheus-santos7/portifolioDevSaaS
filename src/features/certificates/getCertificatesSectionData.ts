import type { CertificateCarouselItem } from "@/features/certificates/components/certificate-carousel-types";
import { getCertificates } from "@/features/certificates/get-certificates";
import { serializeCertificate } from "@/features/certificates/serialize";
import { formatCertificateStatusLabel } from "@/features/certificates/ui";

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
