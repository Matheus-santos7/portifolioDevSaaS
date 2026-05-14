import { NextResponse } from "next/server";

import {
  type CertificateWriteBody,
  createAccountCertificate,
} from "@/features/certificates/mutations";
import { listAccountCertificatesForApi } from "@/features/certificates/queries";
import { getApiProfile } from "@/lib/auth/current-profile";

export async function GET() {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await listAccountCertificatesForApi(profile.id);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as CertificateWriteBody;
  const result = await createAccountCertificate(profile.id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data, { status: 201 });
}
