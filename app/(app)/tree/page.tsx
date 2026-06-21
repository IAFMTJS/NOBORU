import { notFound } from "next/navigation";

import { WorldScreen } from "@/features/worlds/components/world-screen";
import { resolveWorldScrollFocus } from "@/features/worlds/utils/world-scroll-focus.utils";
import { worldService } from "@/features/worlds/services/world.service";
import { getWorldPageContext } from "@/lib/orchestration/world.orchestrator";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";
import type { JlptLevel } from "@/lib/content/types";

type TreePageProps = {
  searchParams: Promise<{
    region?: string;
    node?: string;
    zone?: string;
    jlpt?: string;
  }>;
};

/** Tree tab — renders the current JLPT world in overview mode without redirect. */
export default async function TreePage({ searchParams }: TreePageProps) {
  const userId = await requireAuthenticatedUserId();
  const params = await searchParams;
  const worldId = await worldService.resolveCurrentWorldId(userId);

  const targetWorld =
    params.jlpt && worldService.isValidWorldId(params.jlpt) ? params.jlpt : worldId;

  if (!worldService.isValidWorldId(targetWorld)) {
    notFound();
  }

  const jlptLevel = targetWorld as JlptLevel;
  const { worldPath, portal, regionName, profileStats } =
    await getWorldPageContext(jlptLevel);

  const scrollFocus = resolveWorldScrollFocus(worldPath, {
    highlightNodeId: params.node ?? null,
    regionSlug: params.region ?? null,
  });

  return (
    <WorldScreen
      worldPath={worldPath}
      portal={portal}
      regionName={regionName}
      focusYPercent={scrollFocus.focusYPercent}
      anchorScrollToBottom={scrollFocus.anchorScrollToBottom}
      highlightNodeId={scrollFocus.highlightNodeId}
      variant="overview"
      profileStats={profileStats}
    />
  );
}
