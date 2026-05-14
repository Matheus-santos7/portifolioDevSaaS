import type { ComponentType } from "react";

import type { AboutSectionViewModel } from "@/features/profile/about-section-types";
import { getAboutSectionData } from "@/features/profile/getAboutSectionData";

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
