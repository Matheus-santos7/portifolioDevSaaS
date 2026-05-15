import { NextResponse } from "next/server";

import { uploadAccountAvatar } from "@/app/features/admin/profile/mutations";
import { getApiProfile } from "@/app/lib/auth/current-profile";

export async function POST(request: Request) {
  const profile = await getApiProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const result = await uploadAccountAvatar(profile.id, raw);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
