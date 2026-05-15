import type { Project } from "@prisma/client";

type ProjectWithoutCoverBlob = Omit<Project, "coverImage">;

export function projectWithoutCoverBlob(p: Project): ProjectWithoutCoverBlob {
  const { coverImage, ...rest } = p;
  void coverImage;
  return rest;
}
