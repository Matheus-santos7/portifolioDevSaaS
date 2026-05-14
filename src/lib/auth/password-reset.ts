import { createHash, randomBytes } from "node:crypto";

import { db } from "@/core/db/prisma";
import { hashPassword } from "@/lib/auth/password";

const EXPIRY_MS = 60 * 60 * 1000;

function hashResetToken(plain: string) {
  return createHash("sha256").update(plain, "utf8").digest("hex");
}

/** Gera token em texto claro (só para o e-mail) e persiste apenas o hash. */
export async function issuePasswordResetToken(userId: string) {
  const plain = randomBytes(32).toString("base64url");
  const tokenHash = hashResetToken(plain);

  await db.passwordResetToken.deleteMany({
    where: { userId, consumedAt: null },
  });

  await db.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + EXPIRY_MS),
    },
  });

  return plain;
}

export async function resetPasswordWithToken(rawToken: string, newPassword: string) {
  const tokenHash = hashResetToken(rawToken);

  const row = await db.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!row || row.consumedAt || row.expiresAt < new Date()) {
    return { ok: false as const };
  }

  await db.$transaction([
    db.user.update({
      where: { id: row.userId },
      data: { passwordHash: hashPassword(newPassword) },
    }),
    db.passwordResetToken.deleteMany({
      where: { userId: row.userId },
    }),
  ]);

  return { ok: true as const };
}
