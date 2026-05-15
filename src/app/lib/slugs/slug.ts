export function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeProfileSlug(name: string) {
  const base = toSlug(name) || "portfolio";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}
