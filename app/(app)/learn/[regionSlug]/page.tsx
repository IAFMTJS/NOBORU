import { redirect } from "next/navigation";

type RegionPageProps = {
  params: Promise<{ regionSlug: string }>;
};

export default async function RegionPage({ params }: RegionPageProps) {
  const { regionSlug } = await params;
  redirect(`/tree?region=${encodeURIComponent(regionSlug)}`);
}
