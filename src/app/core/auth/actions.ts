"use server";

import { redirect } from "next/navigation";

import { db } from "@/app/core/db/prisma";
import { getAppUrl } from "@/app/core/utils/site/app-url";
import { loginRedirectWithEmail } from "@/app/lib/auth/error-messages";
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/app/lib/auth/password";
import { issuePasswordResetToken, resetPasswordWithToken } from "@/app/lib/auth/password-reset";
import { createSession, destroySession } from "@/app/lib/auth/session";
import { sendPasswordResetEmail } from "@/app/lib/Resend/email";
import { makeProfileSlug } from "@/app/lib/slugs/slug";

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < MIN_PASSWORD_LENGTH) {
    redirect("/register?err=1");
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.passwordHash) {
      redirect(
        `/forgot-password?email=${encodeURIComponent(email)}&needsPassword=1`,
      );
    }
    redirect(`/login?email=${encodeURIComponent(email)}&existing=1`);
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      profile: {
        create: {
          slug: makeProfileSlug(name),
          slugOnboardingDone: false,
          name,
          email,
          bio: "Atualize sua bio no painel de gestão.",
          perfil: "Desenvolvedor(a)",
          objectives: "Construir produtos digitais de alto impacto.",
          currentSector: "Tecnologia",
          targetSector: "SaaS",
          isPublic: true,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  const selectedProfile = user.profile;
  if (!selectedProfile) {
    redirect("/register?err=2");
  }

  await createSession(user.id, selectedProfile.id, user.email);
  if (!selectedProfile.slugOnboardingDone) {
    redirect("/dashboard/setup-slug");
  }
  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await db.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });

  if (!user) {
    redirect(loginRedirectWithEmail(email, "1"));
  }

  if (!user.passwordHash) {
    redirect(loginRedirectWithEmail(email, "2"));
  }

  const isValid = verifyPassword(password, user.passwordHash);
  if (!isValid) {
    redirect(loginRedirectWithEmail(email, "3"));
  }

  const selectedProfile = user.profile;
  if (!selectedProfile) {
    redirect(loginRedirectWithEmail(email, "4"));
  }

  await createSession(user.id, selectedProfile.id, user.email);
  if (!selectedProfile.slugOnboardingDone) {
    redirect("/dashboard/setup-slug");
  }
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

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
