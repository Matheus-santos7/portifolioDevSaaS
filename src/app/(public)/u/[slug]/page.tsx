import PublicPortfolioScreen from "@/app/features/public/PublicPortfolioScreen";

type PublicPortfolioPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicPortfolioPage({
  params,
}: PublicPortfolioPageProps) {
  const { slug } = await params;
  return <PublicPortfolioScreen slug={slug} />;
}
