"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { CampScreenViewModel } from "@/features/camp/types/camp.types";
import type { ChestEligibilityViewModel } from "@/features/chests/types/chest.types";
import type { QuestDashboardViewModel } from "@/features/quests/types/quest.types";

const VISIBILITY_REFRESH_DEBOUNCE_MS = 800;

function buildDailyGoal(
  daily: QuestDashboardViewModel["daily"],
  fallback: CampScreenViewModel["dailyGoal"],
): CampScreenViewModel["dailyGoal"] {
  return {
    ...fallback,
    progressPercent:
      daily.totalCount === 0
        ? 0
        : Math.round((daily.completedCount / daily.totalCount) * 100),
    label: `${daily.completedCount}/${daily.totalCount} daily quests`,
  };
}

type LiveCampPatch = {
  quests: QuestDashboardViewModel | null;
  chests: ChestEligibilityViewModel[] | null;
};

export function useCampLiveData(initialData: CampScreenViewModel) {
  const router = useRouter();
  const [patch, setPatch] = useState<LiveCampPatch>({
    quests: null,
    chests: null,
  });
  const refreshInFlight = useRef(false);

  const refreshCampData = useCallback(
    async (options?: { revalidateRoute?: boolean }) => {
      if (refreshInFlight.current) return;
      refreshInFlight.current = true;

      try {
        const [questsRes, chestsRes] = await Promise.all([
          fetch("/api/quests", { cache: "no-store" }),
          fetch("/api/chests", { cache: "no-store" }),
        ]);

        const nextPatch: LiveCampPatch = { quests: null, chests: null };

        if (questsRes.ok) {
          const questsPayload = (await questsRes.json()) as {
            success: boolean;
            data?: QuestDashboardViewModel;
          };
          if (questsPayload.success && questsPayload.data) {
            nextPatch.quests = questsPayload.data;
          }
        }

        if (chestsRes.ok) {
          const chestsPayload = (await chestsRes.json()) as {
            success: boolean;
            data?: { chests: ChestEligibilityViewModel[] };
          };
          if (chestsPayload.success && chestsPayload.data) {
            nextPatch.chests = chestsPayload.data.chests;
          }
        }

        if (nextPatch.quests || nextPatch.chests) {
          setPatch((current) => ({
            quests: nextPatch.quests ?? current.quests,
            chests: nextPatch.chests ?? current.chests,
          }));
        }
      } catch {
        // Fall back to SSR props when live fetch fails.
      } finally {
        refreshInFlight.current = false;
      }

      if (options?.revalidateRoute) {
        router.refresh();
      }
    },
    [router],
  );

  useEffect(() => {
    let debounceId: ReturnType<typeof setTimeout> | undefined;
    let wasHidden = document.visibilityState === "hidden";

    const onVisible = () => {
      const isVisible = document.visibilityState === "visible";
      if (isVisible && wasHidden) {
        if (debounceId) clearTimeout(debounceId);
        debounceId = setTimeout(() => {
          void refreshCampData({ revalidateRoute: true });
        }, VISIBILITY_REFRESH_DEBOUNCE_MS);
      }
      wasHidden = document.visibilityState === "hidden";
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      if (debounceId) clearTimeout(debounceId);
    };
  }, [refreshCampData]);

  const data = useMemo((): CampScreenViewModel => {
    const daily = patch.quests?.daily ?? initialData.quests.daily;
    const weekly = patch.quests?.weekly ?? initialData.quests.weekly;

    return {
      ...initialData,
      dailyGoal: patch.quests
        ? buildDailyGoal(daily, initialData.dailyGoal)
        : initialData.dailyGoal,
      chests: patch.chests ?? initialData.chests,
      quests: { daily, weekly },
    };
  }, [initialData, patch.chests, patch.quests]);

  return { data, refreshCampData };
}
