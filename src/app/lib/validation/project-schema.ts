import type { Project } from "@prisma/client";

export const DEFAULT_PROJECT_BACKGROUND_COVER = "/images/projects/default-project.png";

export type ProjectWriteBody = {
  name?: string;
  description?: string;
  backgroundCover?: string;
  repositorio?: string;
  linkView?: string;
};

type ProjectMutableFields = Pick<
  Project,
  "name" | "description" | "backgroundCover" | "repositorio" | "linkView"
>;

type ProjectSchemaError = {
  error: string;
  status: number;
};

type ProjectSchemaResult<T> =
  | { ok: true; value: T }
  | ({ ok: false } & ProjectSchemaError);

function fail(error: string, status = 400): ProjectSchemaResult<never> {
  return { ok: false, error, status };
}

export function validateProjectCreateInput(
  body: ProjectWriteBody,
): ProjectSchemaResult<{
  name: string;
  description: string;
  backgroundCover: string;
  repositorio: string;
  linkView: string;
}> {
  if (!body.name || !body.description || !body.repositorio || !body.linkView) {
    return fail("Invalid payload");
  }

  return {
    ok: true,
    value: {
      name: body.name,
      description: body.description,
      backgroundCover: body.backgroundCover ?? DEFAULT_PROJECT_BACKGROUND_COVER,
      repositorio: body.repositorio,
      linkView: body.linkView,
    },
  };
}

export function buildProjectUpdateData(
  current: ProjectMutableFields,
  body: ProjectWriteBody,
): ProjectSchemaResult<ProjectMutableFields> {
  return {
    ok: true,
    value: {
      name: body.name ?? current.name,
      description: body.description ?? current.description,
      backgroundCover: body.backgroundCover ?? current.backgroundCover,
      repositorio: body.repositorio ?? current.repositorio,
      linkView: body.linkView ?? current.linkView,
    },
  };
}
