import type { DegreeKind } from "@prisma/client";

export type AboutSectionViewModel = {
  name: string;
  slug: string;
  bio: string;
  displayAvatarSrc?: string;
  degreeKind: DegreeKind;
  degreeHighlight: string;
  currentSector: string;
  targetSector: string;
  educationStatus?: string;
  educationCourse?: string;
};
