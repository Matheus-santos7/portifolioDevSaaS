import { NextResponse } from "next/server";

import { getPublicCurriculumBinary } from "@/app/features/public/profile/server/public-binary-assets";
import { getSession } from "@/app/lib/auth/session";

type RouteContext = { params: Promise<{ profileId: string }> };

/** PDF público quando o perfil é público; senão só o dono com sessão. */
export async function GET(_request: Request, context: RouteContext) {
  const { profileId } = await context.params;
  const session = await getSession();
  const result = await getPublicCurriculumBinary(profileId, session?.userId);

  if (result.status !== 200) {
    return new NextResponse(null, { status: result.status });
  }

  return new NextResponse(Buffer.from(result.body), { headers: result.headers });
}
