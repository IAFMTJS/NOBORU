"use client";

import { WorldTreeScreen } from "@/features/journey/components/world-tree-screen";
import type { JourneyPathViewModel } from "@/features/journey/types/journey.types";

type WorldTreeAuditExportProps = {
  journey: JourneyPathViewModel;
};

/** Full-tree render for art audit screenshots (journey built on server). */
export function WorldTreeAuditExport({ journey }: WorldTreeAuditExportProps) {
  return (
    <WorldTreeScreen
      journey={journey}
      regionName="World Tree"
      anchorScrollToBottom={false}
      exportMode
    />
  );
}
