import { NextResponse } from "next/server";

import { getPublicProjectCoverBinary } from "@/app/features/public/projects/public-cover-binary";
import { getSession } from "@/app/lib/auth/session";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const session = await getSession();
  const result = await getPublicProjectCoverBinary(projectId, session?.userId);

  if (result.status !== 200) {
    return new NextResponse(null, { status: result.status });
  }

  return new NextResponse(Buffer.from(result.body), { headers: result.headers });
}
