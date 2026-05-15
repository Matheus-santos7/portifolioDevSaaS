import { NextResponse } from "next/server";

import { putAccountSkillsFromRequest } from "@/app/features/admin/skills/mutations";
import { getSkills } from "@/app/features/public/skills/get-skills";
import { getApiProfile } from "@/app/lib/auth/current-profile";

export async function GET() {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(await getSkills(profile.id));
}

export async function PUT(request: Request) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await request.json();
  const result = await putAccountSkillsFromRequest(profile.id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
