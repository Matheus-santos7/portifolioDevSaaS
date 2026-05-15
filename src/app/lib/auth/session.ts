import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "portfolio_session";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  selectedProfileId: string;
  email: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SESSION_SECRET em falta: defina na Vercel / ambiente. Veja .env.example.",
    );
  }
  return "dev-only-secret-change-in-production";
}

function sign(data: string) {
  return createHmac("sha256", getSessionSecret()).update(data).digest("base64url");
}

function encode(payload: SessionPayload) {
  const base = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(base);
  return `${base}.${signature}`;
}

function decode(token: string): SessionPayload | null {
  const [base, signature] = token.split(".");
  if (!base || !signature) return null;

  const expected = sign(base);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  const isValid = timingSafeEqual(signatureBuffer, expectedBuffer);
  if (!isValid) return null;

  const parsed = JSON.parse(Buffer.from(base, "base64url").toString()) as SessionPayload;
  if (parsed.exp < Date.now()) return null;
  return parsed;
}

export async function createSession(userId: string, selectedProfileId: string, email: string) {
  const payload: SessionPayload = {
    userId,
    selectedProfileId,
    email,
    exp: Date.now() + ONE_WEEK_SECONDS * 1000,
  };
  const token = encode(payload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_WEEK_SECONDS,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
  /** Expira imediatamente para o browser apagar o cookie (alguns clientes ignoram só `delete`). */
  cookieStore.set(COOKIE_NAME, "", opts);
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}
