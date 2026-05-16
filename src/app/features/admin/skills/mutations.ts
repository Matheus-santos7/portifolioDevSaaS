import { Level, type Technology } from "@prisma/client";

import { db } from "@/app/core/db/prisma";
import { getSkills, getTechnologyCatalog } from "@/app/features/server/skills";
import { listLocalTechIcons } from "@/app/lib/technologies/local-public-tech-icons";
import { normalizeTechnologyNameKey } from "@/app/lib/technologies/technology-name-key";
import { guessPresetSvgUrl } from "@/app/lib/technologies/technology-presets";

type UpsertTechnologyInput = {
  name: string;
  svgUrl?: string | null;
};

type SyncSkillInput = {
  technologyId?: string;
  level?: Level;
};

type UpsertTechnologyResult = {
  technology: Technology;
  created: boolean;
};

async function upsertTechnology({
  name,
  svgUrl,
}: UpsertTechnologyInput): Promise<UpsertTechnologyResult> {
  const raw = name.trim();
  if (raw.length < 2 || raw.length > 80) {
    throw new Error("Nome inválido (2–80 caracteres).");
  }

  const preferredSvgRaw = typeof svgUrl === "string" ? svgUrl.trim() : "";
  const preferredSvg =
    preferredSvgRaw.startsWith("/images/tech/") && preferredSvgRaw.length < 500
      ? preferredSvgRaw
      : undefined;

  const nameKey = normalizeTechnologyNameKey(raw);
  const fallbackSvg = guessPresetSvgUrl(nameKey);
  const resolvedSvgUrl = preferredSvg ?? fallbackSvg ?? null;

  const existing = await db.technology.findUnique({ where: { nameKey } });
  if (existing) {
    if (preferredSvg && existing.svgUrl !== preferredSvg) {
      return {
        technology: await db.technology.update({
          where: { id: existing.id },
          data: { svgUrl: preferredSvg },
        }),
        created: false,
      };
    }
    if (!existing.svgUrl && resolvedSvgUrl) {
      return {
        technology: await db.technology.update({
          where: { id: existing.id },
          data: { svgUrl: resolvedSvgUrl },
        }),
        created: false,
      };
    }
    return { technology: existing, created: false };
  }

  try {
    return {
      technology: await db.technology.create({
        data: { name: raw, nameKey, svgUrl: resolvedSvgUrl },
      }),
      created: true,
    };
  } catch {
    const again = await db.technology.findUnique({ where: { nameKey } });
    if (again) return { technology: again, created: false };
    throw new Error("Não foi possível criar a tecnologia.");
  }
}

async function syncProfileSkills(
  profileId: string,
  skills: SyncSkillInput[],
) {
  const rows: { technologyId: string; level: Level }[] = [];
  const seen = new Set<string>();

  for (const row of skills) {
    const technologyId = row.technologyId?.trim();
    if (!technologyId || seen.has(technologyId)) continue;

    seen.add(technologyId);
    rows.push({
      technologyId,
      level:
        row.level && Object.values(Level).includes(row.level)
          ? row.level
          : Level.INTERMEDIATE,
    });
  }

  const techCount = await db.technology.count({
    where: { id: { in: rows.map((row) => row.technologyId) } },
  });
  if (techCount !== rows.length) {
    throw new Error("technologyId inválido.");
  }

  await db.$transaction(async (tx) => {
    await tx.skill.deleteMany({ where: { profileId } });
    if (rows.length === 0) return;

    await tx.skill.createMany({
      data: rows.map((row) => ({
        profileId,
        technologyId: row.technologyId,
        level: row.level,
      })),
    });
  });

  return getSkills(profileId);
}

export async function syncProfileSkillsFromIconSrcs(
  profileId: string,
  iconSrcs: string[],
) {
  const localIcons = listLocalTechIcons();
  const iconBySrc = new Map(localIcons.map((icon) => [icon.src, icon]));
  const uniqueSrcs = [...new Set(iconSrcs.map((src) => src.trim()).filter(Boolean))];
  const rows: SyncSkillInput[] = [];

  for (const src of uniqueSrcs) {
    const icon = iconBySrc.get(src);
    if (!icon) continue;

    const { technology } = await upsertTechnology({
      name: icon.label,
      svgUrl: icon.src,
    });

    rows.push({
      technologyId: technology.id,
      level: Level.INTERMEDIATE,
    });
  }

  const skills = await syncProfileSkills(profileId, rows);

  return {
    catalog: await getTechnologyCatalog(),
    skills,
  };
}

/** PUT `/api/account/skills` — valida corpo e mapeia erros para os mesmos status HTTP. */
export async function putAccountSkillsFromRequest(
  profileId: string,
  body: unknown,
): Promise<
  | { ok: true; data: Awaited<ReturnType<typeof getSkills>> }
  | { ok: false; status: number; error: string }
> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, status: 400, error: "skills deve ser um array." };
  }
  const skills = (body as { skills?: unknown }).skills;
  if (!Array.isArray(skills)) {
    return { ok: false, status: 400, error: "skills deve ser um array." };
  }

  try {
    const data = await syncProfileSkills(profileId, skills as SyncSkillInput[]);
    return { ok: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, status: 400, error: error.message };
    }
    return { ok: false, status: 500, error: "Não foi possível guardar as habilidades." };
  }
}

/** POST `/api/technologies` — envolve `upsertTechnology` com os mesmos códigos de resposta. */
export async function upsertTechnologyFromApiBody(body: {
  name?: string;
  svgUrl?: string | null;
}): Promise<
  | { ok: true; technology: Technology; httpStatus: 200 | 201 }
  | { ok: false; status: number; error: string }
> {
  try {
    const result = await upsertTechnology({
      name: body.name ?? "",
      svgUrl: body.svgUrl,
    });
    return {
      ok: true,
      technology: result.technology,
      httpStatus: result.created ? 201 : 200,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, status: 400, error: error.message };
    }
    return { ok: false, status: 500, error: "Não foi possível criar a tecnologia." };
  }
}
