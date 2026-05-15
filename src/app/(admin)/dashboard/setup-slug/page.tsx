import SetupSlugScreen from "@/app/features/admin/dashboard/SetupSlugScreen";

type PageProps = {
  searchParams: Promise<{ err?: string }>;
};

export default function SetupSlugPage({ searchParams }: PageProps) {
  return <SetupSlugScreen searchParams={searchParams} />;
}
