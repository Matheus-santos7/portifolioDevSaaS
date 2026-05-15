import type { ComponentType } from "react";

type SkillsSectionProps<Data, ViewProps extends object> = {
  profileId: string;
  sectionId?: string;
  View: ComponentType<ViewProps>;
  loadData: (profileId: string) => Promise<Data>;
  mapViewProps: (data: Data) => ViewProps;
};

export default async function SkillsSection<Data, ViewProps extends object>({
  profileId,
  sectionId,
  View,
  loadData,
  mapViewProps,
}: SkillsSectionProps<Data, ViewProps>) {
  const data = await loadData(profileId);

  return (
    <section
      id={sectionId}
      className={`mb-4 flex flex-col gap-4${sectionId ? " scroll-mt-24" : ""}`}
      aria-label="Habilidades"
    >
      <div className="flex flex-col gap-1">
        <h2 className="w-full text-center text-2xl font-bold text-gray-900 dark:text-gray-100 md:w-auto md:text-left">
          Habilidades
        </h2>
      </div>

      <View {...mapViewProps(data)} />
    </section>
  );
}
