"use client";

import { useEffect, useMemo, useState } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { Badge } from "@/components/ui/badge";
import { WorldArtImage } from "@/components/visual/art/world-art-image";
import {
  CampCampfire,
  CampDialogueChip,
  CampFloatingWidget,
  CampFoxIdle,
  CampQuestBoardHotspot,
  CampRewardChest,
  CampScenePanel,
  CampShrineHotspot,
  CampWeatherOverlay,
  CampWorldHotspot,
  resolveShrineLanternAsset,
  type CampRewardChestState,
  type CampfireIntensity,
} from "@/components/visual/camp";
import { HudProfileChip, NavStatChip } from "@/components/visual/navigation";
import { ImmersiveWorldShell } from "@/components/visual/shells";
import { WorldDialogueBubble } from "@/components/visual/primitives";
import { resolveDisplayGemCount } from "@/components/visual/tokens";
import { ChestOpenCeremony } from "@/features/chests/components/chest-open-ceremony";
import type { ChestClaimResult } from "@/features/chests/types/chest.types";
import { DailyQuestBoard } from "@/features/gamification/components/daily-quest-board";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

type CampScreenProps = {
  data: HomeDashboardViewModel;
};

function resolveCampfireIntensity(
  elevationLevel: number,
  streakDays: number,
): CampfireIntensity {
  if (elevationLevel >= 20 || streakDays >= 30) return "advanced";
  if (streakDays >= 14) return "festival";
  if (elevationLevel >= 10 || streakDays >= 7) return "enhanced";
  return "idle";
}

function resolveChestVisualState(
  eligibleCount: number,
  claiming: boolean,
  collectedThisSession: boolean,
): CampRewardChestState {
  if (claiming) return "opening";
  if (collectedThisSession && eligibleCount === 0) return "collected";
  if (eligibleCount > 0) return "available";
  return "closed";
}

export function CampScreen({ data }: CampScreenProps) {
  const [questBoardOpen, setQuestBoardOpen] = useState(false);
  const [shrineOpen, setShrineOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [chestReward, setChestReward] = useState<ChestClaimResult | null>(null);
  const [collectedThisSession, setCollectedThisSession] = useState(false);

  const eligibleChests = useMemo(
    () => data.chests.filter((entry) => entry.eligible),
    [data.chests],
  );
  const hasActiveQuests = data.quests.daily.completedCount < data.quests.daily.totalCount;
  const playerName = data.greeting.replace(/^Kon'nichiwa,\s*/i, "").trim();
  const campfireIntensity = resolveCampfireIntensity(
    data.elevation.level,
    data.stats.currentStreak,
  );
  const chestState = resolveChestVisualState(
    eligibleChests.length,
    claiming,
    collectedThisSession,
  );
  const shrineLanternCount = Math.min(
    5,
    Math.max(1, Math.ceil(data.stats.currentStreak / 7) || 1),
  );
  const scenePanelOpen = questBoardOpen || shrineOpen;
  const pseudoGemCount = resolveDisplayGemCount(data.stats.totalXp);

  async function claimChest() {
    const nextChest = eligibleChests[0];
    if (!nextChest) return;

    setClaiming(true);
    try {
      const res = await fetch("/api/chests/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chestSlug: nextChest.chest.slug }),
      });
      const payload = (await res.json()) as {
        success: boolean;
        data?: ChestClaimResult;
      };
      if (payload.success && payload.data) {
        setChestReward(payload.data);
        if (!payload.data.alreadyClaimed) {
          setCollectedThisSession(true);
        }
      }
    } finally {
      setClaiming(false);
    }
  }

  return (
    <ImmersiveWorldShell
      vignette="camp"
      background={
        <SceneImage
          scene="camp_base"
          alt="Mountain camp at dusk"
          className="absolute inset-0 h-full w-full rounded-none"
          priority
        />
      }
    >
      <CampWeatherOverlay enabled />

      <header className="relative z-10 flex items-start justify-between gap-3 px-3 pt-3">
        <div className="material-hud w-[64%] p-2.5">
          <HudProfileChip displayName={playerName} levelLabel={data.level.label} />
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-trail-glow to-amber-200"
              style={{ width: `${Math.max(6, data.elevation.progressPercent)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <NavStatChip
            icon="flame"
            value={data.stats.currentStreak}
            label="Streak"
            className="text-trail-glow"
          />
          <NavStatChip
            icon="gem"
            value={pseudoGemCount}
            label="Gems"
            className="text-violet-200"
          />
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="relative mx-auto h-full w-full max-w-phone flex-1 px-3 pb-3">
          <CampCampfire
            intensity={campfireIntensity}
            className="absolute bottom-[28%] left-1/2 z-[1] -translate-x-1/2"
          />

          <div className="absolute bottom-[22%] left-[10%] z-10">
            <CampFoxIdle />
          </div>

          <CampRewardChest
            className="bottom-[16%] left-[22%]"
            state={chestState}
            disabled={claiming}
            onClick={() => void claimChest()}
          />

          {!scenePanelOpen ? (
            <>
              <CampDialogueChip className="absolute bottom-[38%] left-[18%] z-20">
                {data.yama.message}
              </CampDialogueChip>

              <CampQuestBoardHotspot
                className="bottom-[44%] right-[6%]"
                hasActiveQuests={hasActiveQuests}
                onClick={() => setQuestBoardOpen(true)}
              />

              <CampShrineHotspot
                className="bottom-[40%] left-[4%]"
                streakDays={data.stats.currentStreak}
                onClick={() => setShrineOpen(true)}
              />

              <CampWorldHotspot
                label="Merchant"
                href="/shop"
                asset={CAMP_WORLD_ASSETS.merchant}
                className="bottom-[24%] right-[10%]"
              />

              <CampWorldHotspot
                label="Tent"
                href="/profile"
                asset={CAMP_WORLD_ASSETS.tent}
                className="bottom-[32%] right-[26%]"
              />

              <CampWorldHotspot
                label="Memory Book"
                href="/memory-book"
                asset={CAMP_WORLD_ASSETS.memory_book}
                className="bottom-[20%] right-[28%]"
              />

              <div className="absolute right-3 top-2 z-20 flex w-[8.5rem] flex-col gap-2">
                <CampFloatingWidget title="Today's Plan">
                  <p className="text-caption text-white/80">{data.dailyGoal.label}</p>
                  <p className="mt-1 text-caption text-trail-glow">
                    {data.quests.daily.completedCount}/{data.quests.daily.totalCount} quests
                  </p>
                </CampFloatingWidget>

                <CampFloatingWidget title="Daily Streak">
                  <div className="flex items-center gap-1.5">
                    <UiIconImage name="flame" size={14} />
                    <span className="text-body-sm font-semibold text-trail-glow">
                      {data.stats.currentStreak} days
                    </span>
                  </div>
                </CampFloatingWidget>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <CampScenePanel
        open={questBoardOpen}
        onClose={() => setQuestBoardOpen(false)}
        title="Quest Board"
        description={`Daily goals from camp — ${data.dailyGoal.label}`}
      >
        <div className="mb-3 flex justify-center">
          <WorldArtImage
            asset={CAMP_WORLD_ASSETS.quest_board}
            alt=""
            width={120}
            height={72}
            presentation="prop"
            className="h-16 w-24"
          />
        </div>
        <DailyQuestBoard
          daily={data.quests.daily}
          weekly={data.quests.weekly}
          variant="compact"
          streakDays={data.stats.currentStreak}
        />
      </CampScenePanel>

      <CampScenePanel
        open={shrineOpen}
        onClose={() => setShrineOpen(false)}
        title="Streak Shrine"
        description="Consistency grows the shrine — never pressure, only progress."
        background={
          <>
            <SceneImage
              scene="shrine_torii"
              alt=""
              className="absolute inset-0 h-full w-full rounded-none object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" aria-hidden />
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-1 py-2" aria-hidden>
            {Array.from({ length: shrineLanternCount }, (_, index) => (
              <WorldArtImage
                key={index}
                asset={resolveShrineLanternAsset(data.stats.currentStreak, {
                  center: index === Math.floor(shrineLanternCount / 2),
                })}
                alt=""
                width={40}
                height={48}
                presentation={
                  index === Math.floor(shrineLanternCount / 2) && data.stats.currentStreak >= 7
                    ? "glow"
                    : "prop"
                }
                className="h-12 w-10"
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {([7, 14, 30, 50] as const).map((milestone) => {
              const reached = data.stats.currentStreak >= milestone;
              return (
                <span
                  key={milestone}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-caption font-medium",
                    reached
                      ? "border-trail-glow/50 bg-trail-glow/15 text-trail-glow"
                      : "border-white/15 bg-black/35 text-muted-foreground",
                  )}
                >
                  {milestone}d {reached ? "✦" : "·"}
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline" className="gap-1 border-white/15 bg-black/35">
              <UiIconImage name="flame" size={14} />
              {data.stats.currentStreak} day streak
            </Badge>
            <Badge variant="outline" className="border-white/15 bg-black/35">
              {data.shrineProtection.tokensAvailable} protection
              {data.shrineProtection.tokensAvailable === 1 ? "" : "s"} stored
            </Badge>
          </div>
          <WorldDialogueBubble speaker="Yama">
            {data.stats.currentStreak > 0
              ? "The lanterns grow brighter with each day you return to the trail."
              : "Light the first lantern by climbing again tomorrow — one step at a time."}
          </WorldDialogueBubble>
        </div>
      </CampScenePanel>

      {chestReward ? (
        <ChestOpenCeremony reward={chestReward} onClose={() => setChestReward(null)} />
      ) : null}
    </ImmersiveWorldShell>
  );
}
