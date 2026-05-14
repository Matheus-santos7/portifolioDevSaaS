import type { DegreeKind } from "@prisma/client";

export function degreeKindLabel(kind: DegreeKind) {
  return kind === "POST_GRADUATION" ? "Pós-graduado" : "Graduado";
}

export function isSafeImageSrc(src: string) {
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
}

export function formationLine(
  degreeKind: DegreeKind,
  degreeHighlight: string,
  educationStatus?: string,
  educationCourse?: string,
) {
  const highlight = degreeHighlight.trim();
  if (highlight) {
    return `${degreeKindLabel(degreeKind)}: ${highlight}`;
  }

  const education = [educationStatus, educationCourse].filter(Boolean).join(" ");
  return education || "";
}
