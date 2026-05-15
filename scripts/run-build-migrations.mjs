/**
 * Aplica migrações antes do `next build` quando faz sentido ligar à BD.
 *
 * - Em Vercel (`VERCEL=1`) ou CI (`CI=true`): corre `prisma migrate deploy`.
 * - Em máquina local: ignora por defeito (Neon suspenso / rede / sem necessidade).
 * - `RUN_BUILD_MIGRATIONS=1`: força migrate no build local.
 * - `SKIP_BUILD_MIGRATIONS=1`: nunca corre migrate (útil se o deploy aplica migrações à parte).
 *
 * Recuperação automática: se `migrate deploy` falhar com P3009 na migração do catálogo
 * Technology (histórico falhado na Neon), corre `migrate resolve --rolled-back` e repete
 * `migrate deploy` uma vez — alinhado ao SQL idempotente nessa pasta de migração.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const FAILED_TECH_CATALOG_MIGRATION = "20260509203000_technology_catalog_skill_fk";

if (process.env.SKIP_BUILD_MIGRATIONS === "1") {
  console.log("[run-build-migrations] SKIP_BUILD_MIGRATIONS=1 — a saltar prisma migrate deploy.");
  process.exit(0);
}

const onVercel = process.env.VERCEL === "1";
const onCi = process.env.CI === "true" || process.env.CI === "1";
const forceLocal = process.env.RUN_BUILD_MIGRATIONS === "1";

if (!onVercel && !onCi && !forceLocal) {
  console.log(
    "[run-build-migrations] Build local: a saltar prisma migrate deploy (evita P1001 se o Neon estiver inativo). " +
      "Na Vercel/CI corre automaticamente. Para forçar aqui: RUN_BUILD_MIGRATIONS=1 pnpm run build",
  );
  process.exit(0);
}

/**
 * @param {readonly string[]} args
 * @param {"inherit" | "piped"} mode
 */
function pnpmExec(args, mode) {
  const piped = mode === "piped";
  const res = spawnSync("pnpm", ["exec", ...args], {
    cwd: root,
    env: process.env,
    encoding: "utf8",
    stdio: piped ? ["inherit", "pipe", "pipe"] : "inherit",
  });
  if (piped && res.stdout) process.stdout.write(res.stdout);
  if (piped && res.stderr) process.stderr.write(res.stderr);
  return res;
}

const first = pnpmExec(["prisma", "migrate", "deploy"], "piped");
if (first.status === 0) {
  process.exit(0);
}

const combined = `${first.stderr ?? ""}\n${first.stdout ?? ""}`;
const isTechCatalogP3009 =
  combined.includes("P3009") && combined.includes(FAILED_TECH_CATALOG_MIGRATION);

if (isTechCatalogP3009) {
  console.log(
    `[run-build-migrations] P3009 (${FAILED_TECH_CATALOG_MIGRATION}) — migrate resolve --rolled-back e novo deploy.`,
  );
  const resolved = pnpmExec(
    ["prisma", "migrate", "resolve", "--rolled-back", FAILED_TECH_CATALOG_MIGRATION],
    "inherit",
  );
  if (resolved.status !== 0) {
    console.error("[run-build-migrations] migrate resolve --rolled-back falhou.");
    process.exit(resolved.status ?? 1);
  }
  const second = pnpmExec(["prisma", "migrate", "deploy"], "inherit");
  process.exit(second.status ?? 1);
}

console.error(`
[run-build-migrations] prisma migrate deploy falhou.

Se o erro for P3009 (outra migração falhada), corre manualmente com DATABASE_URL de produção:
  pnpm prisma migrate resolve --rolled-back <nome_da_migração>
  pnpm prisma migrate deploy
Ver README → «P3009».
`);
process.exit(first.status ?? 1);
