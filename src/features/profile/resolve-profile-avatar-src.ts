type ProfileAvatarFields = {
  id: string;
  updatedAt: Date;
  avatarUrl: string | null;
  hasStoredAvatar: boolean;
  avatarMime: string | null;
};

/** URL final para `<Image src>`: upload na BD (/api/avatar/…) ou URL/caminho externo. */
export function resolveProfileAvatarSrc(profile: ProfileAvatarFields): string | undefined {
  if (profile.hasStoredAvatar && profile.avatarMime?.trim()) {
    return `/api/avatar/${profile.id}?v=${profile.updatedAt.getTime()}`;
  }

  const url = profile.avatarUrl?.trim();
  if (
    url &&
    (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://"))
  ) {
    return url;
  }

  return undefined;
}
