/** Base URL absoluta para links em e-mail e redirects (sem barra final). */
export function getAppUrl() {
  const fromEnv =
    process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL;
  if (!fromEnv) return "http://localhost:3000";
  const trimmed = fromEnv.replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
