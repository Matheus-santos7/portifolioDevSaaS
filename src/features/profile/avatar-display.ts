/** Foto guardada na BD e servida por GET /api/avatar/[profileId]. */
export function isDbAvatarSrc(src: string) {
  return src.startsWith("/api/avatar/");
}
