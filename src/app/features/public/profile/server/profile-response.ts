import type { Profile } from "@prisma/client";

/** Sem campos binários sensíveis no perfil — mantido por compatibilidade com rotas PATCH. */
export function profileWithoutSensitiveBlobs(profile: Profile): Profile {
  return profile;
}
