import type { CertificateKind } from "@prisma/client";

export type CertificateCarouselItem = {
  id: string;
  name: string;
  kind: CertificateKind;
  endDate: string | null;
  emitter: string;
  statusLabel: string;
  link: string;
};
