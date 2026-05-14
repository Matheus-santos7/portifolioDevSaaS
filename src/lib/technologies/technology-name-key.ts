export function normalizeTechnologyNameKey(displayName: string): string {
  return displayName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}
