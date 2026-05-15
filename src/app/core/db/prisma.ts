import { PrismaClient } from "@prisma/client";

/**
 * Reforça timeouts e limita o pool para evitar P2024 (pool esgotado) com Postgres
 * remoto (ex.: Neon), especialmente com vários pedidos RSC em paralelo.
 */
function withDatabaseUrlParams(connectionUrl: string | undefined): string | undefined {
  if (!connectionUrl) return connectionUrl;
  try {
    const url = new URL(connectionUrl);
    // Segundos à espera de uma ligação livre no pool (default Prisma/pg: 10)
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "30");
    }
    // Ligação inicial ao servidor (Neon a frio / rede lenta)
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "25");
    }
    // Evita abrir demasiadas ligações por processo Node (Neon + Next costuma usar ~5–10)
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "10");
    }
    return url.toString();
  } catch {
    return connectionUrl;
  }
}

declare global {
  var cachedPrisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const url = withDatabaseUrlParams(process.env.DATABASE_URL);
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: { url },
    },
  });
}

/** Uma única instância por processo — evita fuga do pool em dev (HMR/Turbopack) e reutiliza ligações no runtime. */
export const db = globalThis.cachedPrisma ?? createPrismaClient();

globalThis.cachedPrisma = db;
