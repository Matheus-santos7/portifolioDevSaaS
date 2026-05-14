import { NextResponse } from "next/server";

import { removeAccountProjectCover, uploadAccountProjectCover } from "@/features/projects/mutations";
import { getApiProfile } from "@/lib/auth/current-profile";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  const profile = await getApiProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const raw = formData.get("file");
  if (!(raw instanceof Blob)) {
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  }

  const result = await uploadAccountProjectCover(profile.id, id, raw);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}

export async function DELETE(_: Request, context: Context) {
  const profile = await getApiProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const result = await removeAccountProjectCover(profile.id, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
