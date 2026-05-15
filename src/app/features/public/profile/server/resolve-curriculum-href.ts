type CurriculumFields = {
  id: string;
  hasStoredCurriculum: boolean;
  updatedAt?: Date;
};

/** Link público para currículo armazenado na BD (`/api/curriculum/…`). */
export function resolveCurriculumHref(profile: CurriculumFields): string | null {
  if (profile.hasStoredCurriculum) {
    const v = profile.updatedAt?.getTime?.();
    return `/api/curriculum/${profile.id}${v != null ? `?v=${v}` : ""}`;
  }
  return null;
}
