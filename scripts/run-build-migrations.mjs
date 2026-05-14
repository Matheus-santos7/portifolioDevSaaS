import { execSync } from "node:child_process";

const shouldRunMigrations =
  process.env.RUN_DB_MIGRATIONS === "true" ||
  process.env.CI === "true" ||
  process.env.VERCEL === "1";

if (!shouldRunMigrations) {
  console.log(
    "[build] Skipping `prisma migrate deploy` in local build. Set RUN_DB_MIGRATIONS=true to force it.",
  );
  process.exit(0);
}

console.log("[build] Running `prisma migrate deploy`...");
execSync("pnpm exec prisma migrate deploy", {
  stdio: "inherit",
});
