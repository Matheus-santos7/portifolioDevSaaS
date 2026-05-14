/**
 * Executado quando o servidor Node arranca (`next start`, dev server).
 * Falha cedo em produção se faltarem variáveis críticas.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  if (process.env.NODE_ENV !== "production") return;

  const missing: string[] = [];
  if (!process.env.DATABASE_URL?.trim()) missing.push("DATABASE_URL");
  if (!process.env.AUTH_SESSION_SECRET?.trim()) missing.push("AUTH_SESSION_SECRET");

  if (missing.length > 0) {
    const msg = `[env] Em produção defina: ${missing.join(", ")}. Veja .env.example.`;
    console.error(msg);
    throw new Error(msg);
  }
}