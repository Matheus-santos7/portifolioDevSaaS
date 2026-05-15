/**
 * Aplica migrações antes do `next build` quando faz sentido ligar à BD.
 *
 * - Em Vercel (`VERCEL=1`) ou CI (`CI=true`): corre `prisma migrate deploy`.
 * - Em máquina local: ignora por defeito; `RUN_BUILD_MIGRATIONS=1` força migrate.
 * - `SKIP_BUILD_MIGRATIONS=1`: nunca corre migrate.
 *
 * Retries de rede (P1001): Neon por vezes não aceita a primeira ligação no build da Vercel
 * (suspend / cold start). `PRISMA_DB_CONNECT_RETRIES` (default 6) e `PRISMA_DB_RETRY_DELAY_SEC` (default 5).
 *
 * Opção nuclear: `PRISMA_RESET_DB_ON_DEPLOY=1` → `prisma migrate reset --force`.
 *
 * Recuperação de migrações falhadas: extrai nome do output (P3018 / P3009) e allowlist.
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

function sleepSeconds(sec) {
  const s = Math.max(1, Math.floor(sec));
  spawnSync("sleep", [String(s)], { stdio: "ignore" });
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
 * Reexecuta o mesmo comando se o Prisma reportar P1001 (Neon inacessível / cold start).
 * @param {string} label
 * @param {readonly string[]} args
 * @param {"inherit" | "piped"} mode
 */
function pnpmExecWithP1001Retries(label, args, mode) {
  const max = Math.max(1, parseInt(process.env.PRISMA_DB_CONNECT_RETRIES ?? "6", 10) || 6);
  const delaySec = Math.max(1, parseInt(process.env.PRISMA_DB_RETRY_DELAY_SEC ?? "5", 10) || 5);
  /** @type {ReturnType<typeof pnpmExec> | null} */
  let last = null;
  for (let i = 0; i < max; i++) {
    last = pnpmExec(args, mode);
    if (last.status === 0) return last;
    const out = `${last.stderr ?? ""}\n${last.stdout ?? ""}`;
    const unreachable =
      out.includes("P1001") ||
      out.includes("Can't reach database") ||
      out.includes("Can't reach database server");
    if (!unreachable || i === max - 1) return last;
    console.warn(
      `[run-build-migrations] ${label}: base inacessível (P1001 / cold start). Nova tentativa ${i + 2}/${max} após ${delaySec}s…`,
    );
    sleepSeconds(delaySec);
  }
  return last;
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
[run-build-migrations] prisma migrate deploy falhou sem recuperação automática de migrações.

Se o erro for P1001 (Neon inacessível):
  • Abre o projeto na Neon e garante que o branch não está apagado / suspenso.
  • Na DATABASE_URL acrescenta por exemplo &connect_timeout=30 (ou ?connect_timeout=30).
  • O script já repete a ligação várias vezes; ajusta PRISMA_DB_CONNECT_RETRIES / PRISMA_DB_RETRY_DELAY_SEC se precisares.

Outras opções:
  • Base de teste: PRISMA_RESET_DB_ON_DEPLOY=1 (uma vez), redeploy, remove a variável.
  • Migrações: migrate resolve --rolled-back <nome> + migrate deploy (ver README).
`);
}

if (process.env.PRISMA_RESET_DB_ON_DEPLOY === "1") {
  console.warn(
    "[run-build-migrations] PRISMA_RESET_DB_ON_DEPLOY=1 — prisma migrate reset --force (APAGA TODOS OS DADOS).",
  );
  const reset = pnpmExecWithP1001Retries(
    "migrate reset",
    ["prisma", "migrate", "reset", "--force"],
    "inherit",
  );
  process.exit(reset.status ?? 1);
}

for (let attempt = 0; attempt < MAX_RECOVERY_ATTEMPTS; attempt++) {
  const deploy = pnpmExecWithP1001Retries("migrate deploy", ["prisma", "migrate", "deploy"], "piped");
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
  const resolved = pnpmExecWithP1001Retries(
    "migrate resolve",
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
