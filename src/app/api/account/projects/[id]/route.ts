import { NextResponse } from "next/server";

import { deleteAccountProject, updateAccountProject } from "@/app/features/admin/projects/mutations";
import { getApiProfile } from "@/app/lib/auth/current-profile";
import type { ProjectWriteBody } from "@/app/lib/validation/project-schema";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: Context) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = (await request.json()) as ProjectWriteBody;
  const result = await updateAccountProject(profile.id, id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}

export async function DELETE(_: Request, context: Context) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const result = await deleteAccountProject(profile.id, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
