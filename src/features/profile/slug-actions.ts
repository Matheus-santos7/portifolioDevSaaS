"use server";

import { redirect } from "next/navigation";

import { db } from "@/core/db/prisma";
import { requireCurrentProfile } from "@/lib/auth/current-profile";
import { isReservedSlug } from "@/lib/slugs/reserved-slugs";
import { toSlug } from "@/lib/slugs/slug";

export async function savePortfolioSlugAction(formData: FormData) {
  const profile = await requireCurrentProfile();
  if (profile.slugOnboardingDone) {
    redirect("/dashboard");
  }

  const raw = String(formData.get("slug") ?? "").trim();
  const slug = toSlug(raw);

  if (slug.length < 3) {
    redirect("/dashboard/setup-slug?err=1");
  }
  if (slug.length > 48) {
    redirect("/dashboard/setup-slug?err=2");
  }
  if (isReservedSlug(slug)) {
    redirect("/dashboard/setup-slug?err=3");
  }

  const taken = await db.profile.findFirst({
    where: { slug, NOT: { id: profile.id } },
    select: { id: true },
  });
  if (taken) {
    redirect("/dashboard/setup-slug?err=4");
  }

  await db.profile.update({
    where: { id: profile.id },
    data: { slug, slugOnboardingDone: true },
  });

  redirect(`/u/${slug}`);
}
