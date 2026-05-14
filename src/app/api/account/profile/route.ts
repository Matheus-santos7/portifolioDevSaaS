import { NextResponse } from "next/server";

import { patchAccountProfile } from "@/features/profile/mutations";
import { getApiProfile } from "@/lib/auth/current-profile";
import type { ProfileWriteBody } from "@/lib/validation/profile-schema";

export async function PATCH(request: Request) {
  const profile = await getApiProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as ProfileWriteBody;
  const result = await patchAccountProfile(profile.id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
