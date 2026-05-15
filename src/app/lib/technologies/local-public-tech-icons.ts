import fs from "node:fs";
import path from "node:path";

export type LocalTechIcon = {
  /** Caminho público (`/images/tech/....svg`). */
  src: string;
  /** Nome legível derivado do ficheiro. */
  label: string;
};

function labelFromTechFilename(filename: string) {
  return filename.replace(/\.svg$/i, "").replace(/-/g, " ");
}

/**
 * Lista SVGs em `public/images/tech/` (uso só no servidor).
 */
export function listLocalTechIcons(): LocalTechIcon[] {
  const dir = path.join(process.cwd(), "public", "images", "tech");
  if (!fs.existsSync(dir)) return [];

  const icons: LocalTechIcon[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".svg")) continue;
    icons.push({
      src: `/images/tech/${encodeURIComponent(entry.name)}`,
      label: labelFromTechFilename(entry.name),
    });
  }
  return icons.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}
