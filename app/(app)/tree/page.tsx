import { N5WorldScreen } from "@/features/worlds/components/n5-world-screen";
import { getJourneyPathWithContext } from "@/lib/orchestration/learn.orchestrator";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";

type TreePageProps = {
  searchParams: Promise<{
    node?: string;
    region?: string;
    unlock?: string;
  }>;
};

/** N5 journey canvas — Realm of First Light (JWorld v1). */
export default async function TreePage({ searchParams }: TreePageProps) {
  const params = await searchParams;
  const { journey, profileStats } = await getJourneyPathWithContext();

  const targetWorld = normalizeRegionSlug(params.region ?? "n5");
  const region =
    journey.regions.find((entry) => normalizeRegionSlug(entry.slug) === targetWorld) ??
    journey.regions.find((entry) => normalizeRegionSlug(entry.slug) === "n5") ??
    journey.regions[0];

  if (!region) {
    return (
      <div className="mx-auto flex h-content max-w-phone flex-col items-center justify-center gap-4 px-4">
        <p className="text-body text-muted-foreground">No journey regions are published yet.</p>
      </div>
    );
  }

  if (targetWorld !== "n5") {
    return (
      <div className="mx-auto flex h-content max-w-phone flex-col gap-6 px-4 py-8">
        <header className="space-y-2">
          <h1 className="text-title font-semibold text-foreground">{region.name}</h1>
          <p className="text-body-sm text-muted-foreground">
            This world unlocks after you complete the Realm of First Light. Continue on the N5
            trail for now.
          </p>
        </header>
        <a
          href="/tree"
          className="inline-flex h-12 items-center justify-center rounded-button bg-primary px-4 text-body font-semibold text-primary-foreground"
        >
          Return to Realm of First Light
        </a>
      </div>
    );
  }

  return (
    <N5WorldScreen
      region={region}
      currentNodeId={journey.position.currentNodeId}
      focusNodeId={params.node ?? journey.position.currentNodeId}
      showPortal={params.unlock === "n4"}
      profileStats={profileStats}
    />
  );
}
