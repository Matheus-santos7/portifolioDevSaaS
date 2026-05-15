import type { Certificate } from "@prisma/client";

/** Payload seguro para componentes cliente (datas em ISO). */
export type CertificateClient = {
  id: string;
  name: string;
  /** Ausente se ainda em andamento e sem data definida. */
  endDate: string | null;
  emitter: string;
  status: Certificate["status"];
  kind: Certificate["kind"];
  link: string;
  profileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export function serializeCertificate(c: Certificate): CertificateClient {
  return {
    id: c.id,
    name: c.name,
    endDate: c.endDate ? c.endDate.toISOString() : null,
    emitter: c.emitter,
    status: c.status,
    kind: c.kind,
    link: c.link,
    profileId: c.profileId,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}
