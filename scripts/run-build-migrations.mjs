/**
 * Aplica migrações antes do `next build` quando faz sentido ligar à BD.
 *
 * - Em Vercel (`VERCEL=1`) ou CI (`CI=true`): corre `prisma migrate deploy`.
 * - Em máquina local: ignora por defeito; `RUN_BUILD_MIGRATIONS=1` força migrate.
 * - `SKIP_BUILD_MIGRATIONS=1`: nunca corre migrate.
 *
 * Opção nuclear (base de teste, poucos dados): `PRISMA_RESET_DB_ON_DEPLOY=1` corre
 * `prisma migrate reset --force` (apaga dados, reaplica todas as migrations).
 *
 * Recuperação automática: se `migrate deploy` falhar, extrai o nome da migração falhada
 * do output Prisma (P3018 / P3009) e, se estiver na allowlist de SQL idempotente no repo,
 * corre `migrate resolve --rolled-back` e repete `migrate deploy`.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Só fazer rollback automático destas pastas — SQL no repo é idempotente / seguro para reaplicar. */
const AUTO_ROLLBACK_ALLOWLIST = new Set([
  "20260509160000_certificate_kind",
  "20260509203000_technology_catalog_skill_fk",
  "20260509220000_technology_svg_url",
]);

const MAX_RECOVERY_ATTEMPTS = 12;

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

/**
 * Extrai o identificador da migração que o Prisma reporta como falhada (P3018 ou P3009).
 * @param {string} combined
 * @returns {string | null}
 */
function extractFailedMigrationName(combined) {
  const p3018 = combined.match(/Migration name:\s*(\S+)/m);
  if (p3018?.[1]) return p3018[1].trim();

  const p3009 = combined.match(/The `([^`]+)` migration/m);
  if (p3009?.[1]) return p3009[1].trim();

  return null;
}

function manualHint() {
  console.error(`
[run-build-migrations] prisma migrate deploy falhou sem recuperação automática.

Opções:
  • Base de teste: define PRISMA_RESET_DB_ON_DEPLOY=1 na Vercel (uma vez), redeploy, depois remove a variável.
  • Manual: DATABASE_URL de produção
      pnpm prisma migrate resolve --rolled-back <nome_da_migração>
      pnpm prisma migrate deploy
Ver README → migrações / deploy.
`);
}

if (process.env.PRISMA_RESET_DB_ON_DEPLOY === "1") {
  console.warn(
    "[run-build-migrations] PRISMA_RESET_DB_ON_DEPLOY=1 — prisma migrate reset --force (APAGA TODOS OS DADOS).",
  );
  const reset = pnpmExec(["prisma", "migrate", "reset", "--force"], "inherit");
  process.exit(reset.status ?? 1);
}

for (let attempt = 0; attempt < MAX_RECOVERY_ATTEMPTS; attempt++) {
  const deploy = pnpmExec(["prisma", "migrate", "deploy"], "piped");
  if (deploy.status === 0) {
    process.exit(0);
  }

  const combined = `${deploy.stderr ?? ""}\n${deploy.stdout ?? ""}`;
  const failedName = extractFailedMigrationName(combined);

  if (!failedName || !AUTO_ROLLBACK_ALLOWLIST.has(failedName)) {
    manualHint();
    if (failedName) {
      console.error(`[run-build-migrations] Migração falhada detetada: ${failedName}`);
    }
    process.exit(deploy.status ?? 1);
  }

  console.log(
    `[run-build-migrations] Falha em «${failedName}» — migrate resolve --rolled-back e nova tentativa.`,
  );
  const resolved = pnpmExec(
    ["prisma", "migrate", "resolve", "--rolled-back", failedName],
    "inherit",
  );
  if (resolved.status !== 0) {
    console.error("[run-build-migrations] migrate resolve --rolled-back falhou.");
    process.exit(resolved.status ?? 1);
  }
}

console.error("[run-build-migrations] Esgotadas tentativas de recuperação automática.");
process.exit(1);
