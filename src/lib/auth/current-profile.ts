import { redirect } from "next/navigation";
import { cache } from "react";

import { db } from "@/app/core/db/prisma";
import { getSession } from "@/app/lib/auth/session";

/**
 * Perfil do utilizador autenticado, sempre alinhado à sessão (`userId` + `selectedProfileId`).
 * Verifica se o utilizador ainda existe na BD (conta apagada / sessão antiga).
 */
export const getCurrentProfile = cache(async function getCurrentProfile() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true },
  });
  if (!user) return null;

  return db.profile.findFirst({
    where: {
      id: session.selectedProfileId,
      userId: session.userId,
    },
  });
});

/** Mesma regra que o dashboard: sessão + utilizador + perfil válidos na BD. */
export async function getApiProfile() {
  const profile = await getCurrentProfile();
  if (!profile) return null;
  return { id: profile.id, email: profile.email };
}

export async function requireCurrentProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}
