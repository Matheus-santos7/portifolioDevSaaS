"use server";

import type { SkillWithTechnology, TechnologyCatalogRow } from "@/features/skills/get-skills";
import { syncProfileSkillsFromIconSrcs } from "@/features/skills/mutations";
import { requireCurrentProfile } from "@/lib/auth/current-profile";

export type SyncSkillsActionResult =
  | {
      ok: true;
      catalog: TechnologyCatalogRow[];
      skills: SkillWithTechnology[];
    }
  | {
      ok: false;
      error: string;
    };

export async function syncSkillsAction(iconSrcs: string[]): Promise<SyncSkillsActionResult> {
  const profile = await requireCurrentProfile();

  if (!Array.isArray(iconSrcs)) {
    return { ok: false, error: "Lista inválida de tecnologias." };
  }

  try {
    const result = await syncProfileSkillsFromIconSrcs(
      profile.id,
      iconSrcs.filter((src): src is string => typeof src === "string"),
    );

    return {
      ok: true,
      catalog: result.catalog,
      skills: result.skills,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Não foi possível guardar as habilidades.",
    };
  }
}
