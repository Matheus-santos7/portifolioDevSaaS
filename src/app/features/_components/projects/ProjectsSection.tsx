import type { ComponentType } from "react";

import { getProjectsSectionData } from "@/app/features/public/projects/server/getProjectsSectionData";

type ProjectsSectionData = Awaited<ReturnType<typeof getProjectsSectionData>>;

type ProjectsSectionProps<ViewProps extends object> = {
  profileId?: string;
  sectionId?: string;
  View: ComponentType<ViewProps>;
  mapViewProps: (data: ProjectsSectionData) => ViewProps;
};

export default async function ProjectsSection<ViewProps extends object>({
  profileId,
  sectionId,
  View,
  mapViewProps,
}: ProjectsSectionProps<ViewProps>) {
  const data = await getProjectsSectionData(profileId);

  return (
    <div
      id={sectionId}
      className={`project-section rounded-xl${sectionId ? " scroll-mt-24" : ""}`}
    >
      <View {...mapViewProps(data)} />
    </div>
  );
}
