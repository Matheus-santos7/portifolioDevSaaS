import { type Certificate, CertificateKind, type Prisma, Status } from "@prisma/client";

import { db } from "@/app/core/db/prisma";

export type CertificateWriteBody = {
  name?: string;
  kind?: string;
  endDate?: string | null;
  emitter?: string;
  status?: string;
  link?: string;
};

type CertificateMutationError = {
  error: string;
  status: number;
};

type CertificateMutationResult<T> =
  | { ok: true; value: T }
  | ({ ok: false } & CertificateMutationError);

type CertificateMutableFields = Pick<
  Certificate,
  "name" | "kind" | "endDate" | "emitter" | "status" | "link"
>;

const VALID_STATUSES = new Set<string>(Object.values(Status));
const VALID_KINDS = new Set<string>(Object.values(CertificateKind));

function fail(error: string, status = 400): CertificateMutationResult<never> {
  return { ok: false, error, status };
}

function parseDate(input: string): Date | null {
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function validateCertificateCreateInput(
  body: CertificateWriteBody,
): CertificateMutationResult<{
  name: string;
  kind: CertificateKind;
  endDate: Date | null;
  emitter: string;
  status: Status;
  link: string;
}> {
  const name = body.name?.trim() ?? "";
  const emitter = body.emitter?.trim() ?? "";
  if (!name || !emitter) {
    return fail("Invalid payload");
  }

  if (!body.kind || !VALID_KINDS.has(body.kind)) {
    return fail("Tipo inválido");
  }

  if (!body.status || !VALID_STATUSES.has(body.status)) {
    return fail("Status inválido");
  }

  const status = body.status as Status;
  const link = body.link?.trim() ?? "";

  if (status !== Status.IN_PROGRESS) {
    if (!link) {
      return fail("Link do certificado é obrigatório neste estado.");
    }
    const parsedRequiredDate = parseDate(body.endDate ?? "");
    if (!parsedRequiredDate) {
      return fail("Data de emissão inválida ou em falta.");
    }
  }

  let endDate: Date | null = null;
  if (body.endDate != null && String(body.endDate).trim() !== "") {
    const parsed = parseDate(String(body.endDate));
    if (!parsed) {
      return fail("Data inválida");
    }
    endDate = parsed;
  }

  if (status !== Status.IN_PROGRESS && !endDate) {
    return fail("Data de emissão é obrigatória neste estado.");
  }

  return {
    ok: true,
    value: {
      name,
      kind: body.kind as CertificateKind,
      endDate,
      emitter,
      status,
      link,
    },
  };
}

function buildCertificateUpdateData(
  current: CertificateMutableFields,
  body: CertificateWriteBody,
): CertificateMutationResult<Prisma.CertificateUpdateInput> {
  if (body.status !== undefined && !VALID_STATUSES.has(body.status)) {
    return fail("Status inválido");
  }

  if (body.kind !== undefined && !VALID_KINDS.has(body.kind)) {
    return fail("Tipo inválido");
  }

  const nextStatus = (body.status !== undefined ? body.status : current.status) as Status;

  let nextEndDate: Date | null | undefined = undefined;
  if (body.endDate !== undefined) {
    if (body.endDate === null || body.endDate === "") {
      nextEndDate = null;
    } else {
      const parsed = parseDate(body.endDate);
      if (!parsed) {
        return fail("Data inválida");
      }
      nextEndDate = parsed;
    }
  }

  const mergedEndDate = nextEndDate !== undefined ? nextEndDate : current.endDate;
  const mergedLink = body.link !== undefined ? body.link.trim() : current.link;

  if (nextStatus !== Status.IN_PROGRESS) {
    if (!mergedEndDate) {
      return fail("Data de emissão é obrigatória neste estado.");
    }
    if (!mergedLink) {
      return fail("Link do certificado é obrigatório neste estado.");
    }
  }

  return {
    ok: true,
    value: {
      name: body.name !== undefined ? body.name.trim() : current.name,
      endDate: nextEndDate !== undefined ? nextEndDate : undefined,
      emitter: body.emitter !== undefined ? body.emitter.trim() : current.emitter,
      status: nextStatus,
      kind: body.kind !== undefined ? (body.kind as CertificateKind) : current.kind,
      link: body.link !== undefined ? body.link.trim() : current.link,
    },
  };
}

type AccountCertificateMutationError = { ok: false; status: number; error: string };

type Ok<T> = { ok: true; data: T };

export async function createAccountCertificate(
  profileId: string,
  body: CertificateWriteBody,
): Promise<Ok<Certificate> | AccountCertificateMutationError> {
  const validated = validateCertificateCreateInput(body);
  if (!validated.ok) {
    return { ok: false, status: validated.status, error: validated.error };
  }

  const created = await db.certificate.create({
    data: {
      profileId,
      ...validated.value,
    },
  });

  return { ok: true, data: created };
}

export async function updateAccountCertificate(
  profileId: string,
  certificateId: string,
  body: CertificateWriteBody,
): Promise<Ok<Certificate> | AccountCertificateMutationError | { ok: false; status: 404; error: string }> {
  const row = await db.certificate.findFirst({
    where: { id: certificateId, profileId },
  });
  if (!row) {
    return { ok: false, status: 404, error: "Not found" };
  }

  const updateData = buildCertificateUpdateData(row, body);
  if (!updateData.ok) {
    return { ok: false, status: updateData.status, error: updateData.error };
  }

  const updated = await db.certificate.update({
    where: { id: row.id },
    data: updateData.value,
  });

  return { ok: true, data: updated };
}

export async function deleteAccountCertificate(
  profileId: string,
  certificateId: string,
): Promise<Ok<{ success: true }> | { ok: false; status: 404; error: string }> {
  const row = await db.certificate.findFirst({
    where: { id: certificateId, profileId },
  });
  if (!row) {
    return { ok: false, status: 404, error: "Not found" };
  }

  await db.certificate.delete({ where: { id: row.id } });
  return { ok: true, data: { success: true as const } };
}
