import { notFound } from "next/navigation";

import { WorldScreen } from "@/features/worlds/components/world-screen";
import { resolveWorldScrollFocus } from "@/features/worlds/utils/world-scroll-focus.utils";
import { worldService } from "@/features/worlds/services/world.service";
import { getWorldPageContext } from "@/lib/orchestration/world.orchestrator";
import type { JlptLevel } from "@/lib/content/types";

type WorldPageProps = {
  params: Promise<{ jlptLevel: string }>;
  searchParams: Promise<{
    region?: string;
    node?: string;
    mode?: string;
  }>;
};

export default async function WorldPage({ params, searchParams }: WorldPageProps) {
  const { jlptLevel: jlptLevelParam } = await params;
  const query = await searchParams;

  if (!worldService.isValidWorldId(jlptLevelParam)) {
    notFound();
  }

  const jlptLevel = jlptLevelParam as JlptLevel;
  const { worldPath, portal, regionName, profileStats } =
    await getWorldPageContext(jlptLevel);

  const scrollFocus = resolveWorldScrollFocus(worldPath, {
    highlightNodeId: query.node ?? null,
    regionSlug: query.region ?? null,
  });

  const variant = query.mode === "overview" ? "overview" : "journey";

  return (
    <WorldScreen
      worldPath={worldPath}
      portal={portal}
      regionName={regionName}
      focusYPercent={scrollFocus.focusYPercent}
      anchorScrollToBottom={scrollFocus.anchorScrollToBottom}
      highlightNodeId={scrollFocus.highlightNodeId}
      variant={variant}
      profileStats={profileStats}
    />
  );
}
