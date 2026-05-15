/** Slugs que conflitam com rotas da aplicação. */
const RESERVED_SLUGS = new Set([
  "api",
  "login",
  "register",
  "logout",
  "dashboard",
  "forgot-password",
  "reset-password",
  "u",
  "projects",
  "portfolio",
  "certificates",
  "admin",
  "static",
  "_next",
  "favicon",
]);

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
