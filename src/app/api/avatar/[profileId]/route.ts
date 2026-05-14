import { NextResponse } from "next/server";

import { getPublicAvatarBinary } from "@/features/profile/public-binary-assets";
import { getSession } from "@/lib/auth/session";

type RouteContext = { params: Promise<{ profileId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { profileId } = await context.params;
  const session = await getSession();
  const result = await getPublicAvatarBinary(profileId, session?.userId);

  if (result.status !== 200) {
    return new NextResponse(null, { status: result.status });
  }

  return new NextResponse(Buffer.from(result.body), { headers: result.headers });
}
