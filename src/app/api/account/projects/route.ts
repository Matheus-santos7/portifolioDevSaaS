import { NextResponse } from "next/server";

import { createAccountProject } from "@/features/projects/mutations";
import { listAccountProjectsForApi } from "@/features/projects/queries";
import { getApiProfile } from "@/lib/auth/current-profile";
import type { ProjectWriteBody } from "@/lib/validation/project-schema";

export async function GET() {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await listAccountProjectsForApi(profile.id);
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as ProjectWriteBody;
  const result = await createAccountProject(profile.id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data, { status: 201 });
}
