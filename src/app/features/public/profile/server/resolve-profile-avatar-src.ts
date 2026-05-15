type ProfileAvatarFields = {
  avatarUrl: string | null;
};

/** URL final para `<Image src>` ou externo. */
export function resolveProfileAvatarSrc(profile: ProfileAvatarFields): string | undefined {
  const url = profile.avatarUrl?.trim();
  if (
    url &&
    (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://"))
  ) {
    return url;
  }

  return undefined;
}
