type CurriculumFields = {
  curriculum: string | null;
};

/** Link público para o currículo (URL externa ou PDF no Vercel Blob). */
export function resolveCurriculumHref(profile: CurriculumFields): string | null {
  const url = profile.curriculum?.trim();
  if (!url) return null;
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return null;
}
