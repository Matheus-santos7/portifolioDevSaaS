import SiteHeaderClient from "@/features/dashboard/components/SiteHeaderClient";

type AdminDashboardHeaderProps = {
  name: string;
  slug: string;
  curriculumHref?: string | null;
  phone?: string | null;
};

export default function AdminDashboardHeader({
  name,
  slug,
  curriculumHref,
  phone,
}: AdminDashboardHeaderProps) {
  return (
    <SiteHeaderClient
      name={name}
      domain={slug}
      curriculumHref={curriculumHref ?? undefined}
      phone={phone ?? undefined}
      isAuthenticated
      isAdmin
    />
  );
}
