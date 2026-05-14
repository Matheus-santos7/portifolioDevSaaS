import { NextResponse } from "next/server";

import {
  type CertificateWriteBody,
  deleteAccountCertificate,
  updateAccountCertificate,
} from "@/features/certificates/mutations";
import { getApiProfile } from "@/lib/auth/current-profile";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = (await request.json()) as CertificateWriteBody;
  const result = await updateAccountCertificate(profile.id, id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}

export async function DELETE(_: Request, context: Context) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const result = await deleteAccountCertificate(profile.id, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
