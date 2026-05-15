import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

/** Alinhado em servidor e formulários (registo, login, reset). */
export const MIN_PASSWORD_LENGTH = 8;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const computed = scryptSync(password, salt, KEY_LENGTH);
  const known = Buffer.from(hash, "hex");

  if (known.length !== computed.length) return false;
  return timingSafeEqual(known, computed);
}
