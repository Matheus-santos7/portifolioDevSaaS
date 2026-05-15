import { NextResponse } from "next/server";

import { upsertTechnologyFromApiBody } from "@/app/features/admin/skills/mutations";
import { getTechnologyCatalog } from "@/app/features/public/skills/server/get-skills";
import { getApiProfile } from "@/app/lib/auth/current-profile";

export async function GET() {
  const list = await getTechnologyCatalog();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { name?: string; svgUrl?: string | null };
  const result = await upsertTechnologyFromApiBody(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.technology, { status: result.httpStatus });
}
