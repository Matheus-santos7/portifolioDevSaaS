/**
 * Aplica migrações antes do `next build` quando faz sentido ligar à BD.
 *
 * - Em Vercel (`VERCEL=1`) ou CI (`CI=true`): corre `prisma migrate deploy`.
 * - Em máquina local: ignora por defeito (Neon suspenso / rede / sem necessidade).
 * - `RUN_BUILD_MIGRATIONS=1`: força migrate no build local.
 * - `SKIP_BUILD_MIGRATIONS=1`: nunca corre migrate.
 *
 * Recuperação automática (várias tentativas): migrações com SQL idempotente no repo mas
 * estado falhado/drift na `_prisma_migrations`. Para cada falha reconhecida, corre
 * `migrate resolve --rolled-back <nome>` e volta a tentar `migrate deploy`.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Migrações cujo SQL no repo foi tornado seguro para reaplicar após `--rolled-back`. */
const RECOVERY_RULES = [
  {
    migration: "20260509203000_technology_catalog_skill_fk",
    matches: (out) =>
      out.includes("20260509203000_technology_catalog_skill_fk") &&
      (out.includes("P3009") ||
        out.includes("P3018") ||
        out.includes("42P07")),
  },
  {
    migration: "20260509160000_certificate_kind",
    matches: (out) =>
      out.includes("20260509160000_certificate_kind") &&
      (out.includes("P3009") || out.includes("P3018") || out.includes("42710")),
  },
];

const MAX_RECOVERY_ATTEMPTS = 6;

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

/** @param {string} combined */
function migrationToRecover(combined) {
  for (const rule of RECOVERY_RULES) {
    if (rule.matches(combined)) return rule.migration;
  }
  return null;
}

function manualHint() {
  console.error(`
[run-build-migrations] prisma migrate deploy falhou sem recuperação automática reconhecida.

Corre manualmente com DATABASE_URL de produção:
  pnpm prisma migrate resolve --rolled-back <nome_da_migração>
  pnpm prisma migrate deploy
Ver README → «P3009».
`);
}

for (let attempt = 0; attempt < MAX_RECOVERY_ATTEMPTS; attempt++) {
  const deploy = pnpmExec(["prisma", "migrate", "deploy"], "piped");
  if (deploy.status === 0) {
    process.exit(0);
  }

  const combined = `${deploy.stderr ?? ""}\n${deploy.stdout ?? ""}`;
  const migration = migrationToRecover(combined);

  if (!migration) {
    manualHint();
    process.exit(deploy.status ?? 1);
  }

  console.log(
    `[run-build-migrations] Falha reconhecida (${migration}) — migrate resolve --rolled-back e nova tentativa.`,
  );
  const resolved = pnpmExec(
    ["prisma", "migrate", "resolve", "--rolled-back", migration],
    "inherit",
  );
  if (resolved.status !== 0) {
    console.error("[run-build-migrations] migrate resolve --rolled-back falhou.");
    process.exit(resolved.status ?? 1);
  }
}

console.error("[run-build-migrations] Esgotadas tentativas de recuperação automática.");
process.exit(1);
