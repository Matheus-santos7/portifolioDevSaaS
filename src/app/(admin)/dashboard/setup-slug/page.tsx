import SetupSlugScreen from "@/features/dashboard/components/SetupSlugScreen";

type PageProps = {
  searchParams: Promise<{ err?: string }>;
};

export default function SetupSlugPage({ searchParams }: PageProps) {
  return <SetupSlugScreen searchParams={searchParams} />;
}
