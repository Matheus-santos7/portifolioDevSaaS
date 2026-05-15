/**
 * Aplica migrações antes do `next build` quando faz sentido ligar à BD.
 *
 * - Em Vercel (`VERCEL=1`) ou CI (`CI=true`): corre `prisma migrate deploy`.
 * - Em máquina local: ignora por defeito (Neon suspenso / rede / sem necessidade).
 * - `RUN_BUILD_MIGRATIONS=1`: força migrate no build local.
 * - `SKIP_BUILD_MIGRATIONS=1`: nunca corre migrate (útil se o deploy aplica migrações à parte).
 */
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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

execSync("pnpm exec prisma migrate deploy", {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});
