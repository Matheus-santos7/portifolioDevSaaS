import { NextRequest, NextResponse } from "next/server";

import { destroySession } from "@/app/lib/auth/session";

/**
 * Limpa o cookie de sessão (só permitido em Route Handler, não em Layout/RSC).
 * Usado quando a sessão não corresponde a um utilizador/perfil válido.
 */
export async function GET(request: NextRequest) {
  await destroySession();
  return NextResponse.redirect(new URL("/login", request.url));
}
