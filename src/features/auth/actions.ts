"use server";

import { redirect } from "next/navigation";

import { db } from "@/core/db/prisma";
import { loginRedirectWithEmail } from "@/lib/auth/error-messages";
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { makeProfileSlug } from "@/lib/slugs/slug";

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
