import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentProfile } from "@/app/lib/auth/current-profile";

/**
 * Todas as rotas em `/dashboard/*` exigem sessão válida + perfil na BD (`userId` + `selectedProfileId`).
 * Não é possível apagar cookies aqui (RSC); redirecionamos para uma Route Handler que limpa o cookie.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/api/auth/invalidate-session");
  }

  return children;
}
