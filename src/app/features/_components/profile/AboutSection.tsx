import type { ComponentType } from "react";

import { getAboutSectionData } from "@/app/features/public/profile/server/about-section-data";
import type { AboutSectionViewModel } from "@/app/features/public/profile/server/types";

type AboutSectionProps = {
  profileId: string;
  View: ComponentType<AboutSectionViewModel>;
};

export default async function AboutSection({
  profileId,
  View,
}: AboutSectionProps) {
  const data = await getAboutSectionData(profileId);
  if (!data) return null;

  return <View {...data} />;
}
