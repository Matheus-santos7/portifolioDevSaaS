import { NextResponse } from "next/server";

import {
  type CertificateWriteBody,
  createAccountCertificate,
} from "@/app/features/admin/certificates/mutations";
import { getCertificates } from "@/app/features/server/certificates";
import { getApiProfile } from "@/app/lib/auth/current-profile";

export async function GET() {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await getCertificates(profile.id);
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
