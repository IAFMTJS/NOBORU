import { redirect } from "next/navigation";

import { resolveWorldForRegionSlug } from "@/features/worlds/constants/world-registry.constants";

type RegionPageProps = {
  params: Promise<{ regionSlug: string }>;
};

export default async function RegionPage({ params }: RegionPageProps) {
  const { regionSlug } = await params;
  const world = resolveWorldForRegionSlug(regionSlug);
  const worldSegment = world ? `/worlds/${world.id}` : "/learn";

  redirect(`${worldSegment}?region=${encodeURIComponent(regionSlug)}`);
}
