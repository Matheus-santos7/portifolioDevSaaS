import type { ComponentType } from "react";

import { getCertificatesSectionData } from "@/app/features/public/certificates/server/getCertificate";

type CertificatesSectionData = Awaited<ReturnType<typeof getCertificatesSectionData>>;

type CertificatesSectionProps<ViewProps extends object> = {
  profileId?: string;
  sectionId?: string;
  View: ComponentType<ViewProps>;
  mapViewProps: (data: CertificatesSectionData) => ViewProps;
};

export default async function CertificatesSection<ViewProps extends object>({
  profileId,
  sectionId,
  View,
  mapViewProps,
}: CertificatesSectionProps<ViewProps>) {
  const data = await getCertificatesSectionData(profileId);

  return (
    <div
      id={sectionId}
      className={`project-section w-full rounded-xl${sectionId ? " scroll-mt-24" : ""}`}
    >
      <View {...mapViewProps(data)} />
    </div>
  );
}
