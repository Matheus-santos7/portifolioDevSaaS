"use server";

import { redirect } from "next/navigation";

import { db } from "@/core/db/prisma";
import { getAppUrl } from "@/core/utils/site/app-url";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import { issuePasswordResetToken, resetPasswordWithToken } from "@/lib/auth/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";

/** Intervalo mínimo entre e-mails de recuperação (segundos). Padrão 120 s (2 min). Use 0 só em dev. */
function getPasswordResetCooldownMs() {
  const raw = process.env.PASSWORD_RESET_COOLDOWN_SECONDS;
  if (raw == null || raw === "") return 2 * 60 * 1000;
  const sec = Number(raw);
  if (!Number.isFinite(sec) || sec < 0) return 2 * 60 * 1000;
  return sec * 1000;
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    redirect("/forgot-password?err=1");
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    redirect("/forgot-password?sent=1");
  }

  const last = user.lastPasswordResetSentAt;
  const cooldownMs = getPasswordResetCooldownMs();
  if (cooldownMs > 0 && last && Date.now() - last.getTime() < cooldownMs) {
    redirect("/forgot-password?sent=1");
  }

  try {
    const plain = await issuePasswordResetToken(user.id);
    const url = `${getAppUrl()}/reset-password?token=${encodeURIComponent(plain)}`;
    await sendPasswordResetEmail(user.email, url);
    await db.user.update({
      where: { id: user.id },
      data: { lastPasswordResetSentAt: new Date() },
    });
  } catch (error) {
    console.error("[password-reset] falha ao enviar e-mail:", error);
  }

  redirect("/forgot-password?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token || password.length < MIN_PASSWORD_LENGTH || password !== confirm) {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&err=2`);
  }

  const result = await resetPasswordWithToken(token, password);
  if (!result.ok) {
    redirect("/reset-password?err=1");
  }

  redirect("/login?reset=ok");
}
