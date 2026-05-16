import type { DegreeKind } from "@prisma/client";

function degreeKindLabel(kind: DegreeKind) {
  return kind === "POST_GRADUATION" ? "Pós-graduado" : "Graduado";
}

/** Linha única de formação para a grelha «Sobre». */
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
