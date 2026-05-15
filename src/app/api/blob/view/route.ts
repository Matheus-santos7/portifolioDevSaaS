import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { isPrivateVercelBlobUrl, isVercelBlobUrl } from "@/app/lib/storage/blob-url";
import { getBlobReadWriteToken } from "@/app/lib/storage/vercel-blob";

function parseTargetUrl(raw: string | null): string | null {
  if (!raw?.trim()) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (!isVercelBlobUrl(decoded)) return null;
  try {
    const u = new URL(decoded);
    if (u.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return decoded;
}

/**
 * Serve blobs do Vercel (sobretudo **private**) com o token RW no servidor.
 * O browser não pode fazer GET anónimo a `*.private.blob.vercel-storage.com` (403).
 */
export async function GET(request: Request) {
  const target = parseTargetUrl(new URL(request.url).searchParams.get("u"));
  if (!target) {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  const token = getBlobReadWriteToken();
  if (!token) {
    return NextResponse.json({ error: "Armazenamento não configurado" }, { status: 503 });
  }

  const access = isPrivateVercelBlobUrl(target) ? "private" : "public";
  const ifNoneMatch = request.headers.get("if-none-match") ?? undefined;

  const result = await get(target, {
    access,
    token,
    ...(ifNoneMatch ? { ifNoneMatch } : {}),
  });

  if (!result) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  if (result.statusCode === 304) {
    const headers = new Headers();
    const etag = result.headers.get("etag");
    if (etag) headers.set("etag", etag);
    return new NextResponse(null, { status: 304, headers });
  }

  if (result.statusCode !== 200 || !result.stream) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", result.blob.contentType);
  headers.set("Content-Length", String(result.blob.size));
  const etag = result.blob.etag;
  if (etag) headers.set("ETag", etag);
  headers.set("Cache-Control", "public, max-age=120, s-maxage=120, stale-while-revalidate=86400");

  return new NextResponse(result.stream, { status: 200, headers });
}
