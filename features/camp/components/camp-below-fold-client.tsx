"use client";

import { createContext, useContext, useMemo } from "react";

import { useCampLiveData } from "@/features/camp/hooks/use-camp-live-data";
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

export function useCampScreenData(initialData: CampScreenViewModel): {
  data: CampScreenViewModel;
  refreshCampData: () => Promise<void>;
} {
  const belowFold = useCampBelowFold({
    shrineProtection: initialData.shrineProtection,
    quests: {
      weekly: initialData.quests.weekly,
    },
  });

  const mergedInitial = useMemo(
    (): CampScreenViewModel => ({
      ...initialData,
      shrineProtection: belowFold.shrineProtection,
      quests: {
        daily: initialData.quests.daily,
        weekly: belowFold.quests.weekly,
      },
    }),
    [belowFold, initialData],
  );

  return useCampLiveData(mergedInitial);
}
