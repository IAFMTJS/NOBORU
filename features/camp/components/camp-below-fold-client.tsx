"use client";

import { createContext, useContext, useMemo } from "react";

import type {
  CampBelowFoldViewModel,
  CampScreenViewModel,
} from "@/features/camp/types/camp.types";

const CampBelowFoldContext = createContext<CampBelowFoldViewModel | null>(null);

export function CampBelowFoldClient({
  belowFold,
}: {
  belowFold: CampBelowFoldViewModel;
}) {
  return (
    <CampBelowFoldContext.Provider value={belowFold}>
      {null}
    </CampBelowFoldContext.Provider>
  );
}

export function useCampBelowFold(
  defaults: CampBelowFoldViewModel,
): CampBelowFoldViewModel {
  return useContext(CampBelowFoldContext) ?? defaults;
}

export function useCampScreenData(
  initialData: CampScreenViewModel,
): CampScreenViewModel {
  const belowFold = useCampBelowFold({
    shrineProtection: initialData.shrineProtection,
    quests: {
      weekly: initialData.quests.weekly,
    },
  });

  return useMemo(
    () => ({
      ...initialData,
      shrineProtection: belowFold.shrineProtection,
      quests: {
        daily: initialData.quests.daily,
        weekly: belowFold.quests.weekly,
      },
    }),
    [belowFold, initialData],
  );
}
