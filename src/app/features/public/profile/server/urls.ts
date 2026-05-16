import { proxiedBlobSrcForPublicRead } from "@/app/lib/storage/blob-url";

/** `src` seguro para `<img>` / `<Image>` (path local ou URL absoluta). */
export function isSafeImageSrc(src: string) {
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
}

type ProfileAvatarFields = {
  avatarUrl: string | null;
};

/** URL final para `<Image src>` (inclui proxy para Blob private). */
export function resolveProfileAvatarSrc(profile: ProfileAvatarFields): string | undefined {
  const url = profile.avatarUrl?.trim();
  if (
    url &&
    (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://"))
  ) {
    return url.startsWith("https://") ? proxiedBlobSrcForPublicRead(url) : url;
  }

  return undefined;
}

type CurriculumFields = {
  curriculum: string | null;
};

/** Link público para o currículo (URL externa ou ficheiro servido por path/URL). */
export function resolveCurriculumHref(profile: CurriculumFields): string | null {
  const url = profile.curriculum?.trim();
  if (!url) return null;
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return null;
}
