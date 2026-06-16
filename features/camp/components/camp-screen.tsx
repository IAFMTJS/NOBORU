"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { Badge } from "@/components/ui/badge";
import { ChestOpenCeremony } from "@/features/chests/components/chest-open-ceremony";
import type { ChestClaimResult } from "@/features/chests/types/chest.types";
import { DailyQuestBoard } from "@/features/gamification/components/daily-quest-board";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import {
  CampCampfire,
  CampFoxIdle,
  CampQuestBoardHotspot,
  CampRewardChest,
  CampShrineHotspot,
  CampWeatherOverlay,
  WorldArtImage,
  resolveShrineLanternAsset,
  type CampRewardChestState,
  type CampfireIntensity,
} from "@/components/visual/world";
import { WorldDialogueBubble } from "@/components/visual/world-dialogue-bubble";
import { IllustratedScreen } from "@/components/visual";
import { CAMP_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

type CampScreenProps = {
  data: HomeDashboardViewModel;
};

type CampScenePanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  background?: ReactNode;
};

/** In-scene panel — camp world stays visible behind the interaction. */
function CampScenePanel({
  open,
  onClose,
  title,
  description,
  children,
  className,
  background,
}: CampScenePanelProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        className="absolute inset-0 z-20 bg-black/25"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal
        aria-labelledby="camp-scene-panel-title"
        aria-describedby="camp-scene-panel-description"
        className={cn(
          "absolute z-30 w-[min(100%,20rem)] overflow-hidden rounded-card border border-white/15 shadow-elevation-2",
          background ? "bg-black/55" : "bg-black/65 backdrop-blur-md",
          className,
        )}
      >
        {background}
        <div className="relative z-10 flex max-h-[min(52dvh,24rem)] flex-col">
          <header className="flex items-start justify-between gap-3 border-b border-white/10 p-3">
            <div className="space-y-0.5 text-left">
              <h2 id="camp-scene-panel-title" className="font-story text-sm text-trail-glow">
                {title}
              </h2>
              <p id="camp-scene-panel-description" className="text-caption text-white/70">
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="focus-ring rounded-sm p-1 text-white/70 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">{children}</div>
        </div>
      </aside>
    </>
  );
}

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

type CampWorldHotspotLinkProps = {
  label: string;
  href: string;
  className?: string;
  asset: (typeof CAMP_WORLD_ASSETS)[keyof typeof CAMP_WORLD_ASSETS];
  glow?: boolean;
};

function CampWorldHotspotLink({
  label,
  href,
  className,
  asset,
  glow = false,
}: CampWorldHotspotLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "focus-ring group absolute flex flex-col items-center gap-1 transition hover:scale-[1.03] active:scale-[0.98]",
        className,
      )}
    >
      <div
        className={cn(
          "relative drop-shadow-lg transition group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]",
          glow && "trail-glow-warm",
        )}
      >
        <WorldArtImage
          asset={asset}
          alt=""
          width={72}
          height={72}
          renderMode="icon"
          className="h-14 w-14 object-cover object-center"
        />
      </div>
      <span className="rounded-full border border-white/10 bg-black/45 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
        {label}
      </span>
    </Link>
  );
}

export function CampScreen({ data }: CampScreenProps) {
  const searchParams = useSearchParams();
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

  useEffect(() => {
    if (searchParams?.get("quests") === "1") {
      setQuestBoardOpen(true);
    }
  }, [searchParams]);

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
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="camp_base"
          alt="Mountain camp at dusk"
          className="absolute inset-0 min-h-dvh rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <CampWeatherOverlay enabled />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/70" aria-hidden />

        <header className="relative z-10 flex justify-end gap-2 p-4 pt-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-caption font-semibold tabular-nums text-white/90 backdrop-blur-sm">
            <UiIconImage name="zap" size={14} />
            <span className="sr-only">Level </span>
            {data.level.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-caption font-semibold tabular-nums text-trail-glow backdrop-blur-sm">
            <UiIconImage name="flame" size={14} />
            <span className="sr-only">Streak </span>
            {data.stats.currentStreak}
          </span>
        </header>

        <div className="relative z-10 flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <CampCampfire
            intensity={campfireIntensity}
            className="absolute bottom-[36%] left-1/2 z-[1] -translate-x-1/2"
          />

          <div className="absolute bottom-[30%] left-[14%] z-10">
            <CampFoxIdle />
          </div>

          <CampQuestBoardHotspot
            className="bottom-[40%] right-[4%]"
            hasActiveQuests={hasActiveQuests}
            onClick={() => setQuestBoardOpen(true)}
          />

          <CampShrineHotspot
            className="bottom-[38%] left-[2%]"
            streakDays={data.stats.currentStreak}
            onClick={() => setShrineOpen(true)}
          />

          <CampRewardChest
            className="bottom-[24%] left-[14%]"
            state={chestState}
            disabled={claiming}
            onClick={() => void claimChest()}
          />

          <CampWorldHotspotLink
            label="Merchant"
            href="/shop"
            asset={CAMP_WORLD_ASSETS.merchant}
            className="bottom-[26%] right-[12%]"
          />

          <CampWorldHotspotLink
            label="Tent"
            href="/profile"
            asset={CAMP_WORLD_ASSETS.tent}
            className="bottom-[34%] right-[28%]"
          />

          <CampWorldHotspotLink
            label="Memory"
            href="/memory-book"
            asset={CAMP_WORLD_ASSETS.memory_book}
            className="bottom-[22%] right-[30%]"
          />

          <CampWorldHotspotLink
            label="Shrine"
            href="/achievements"
            asset={CAMP_WORLD_ASSETS.achievement_shrine}
            glow
            className="bottom-[30%] left-[18%]"
          />

          <CampScenePanel
            open={questBoardOpen}
            onClose={() => setQuestBoardOpen(false)}
            title="Quest Board"
            description={`Daily goals from camp — ${data.dailyGoal.label}`}
            className="bottom-[44%] right-[2%]"
          >
            <div className="mb-3 flex justify-center">
              <WorldArtImage
                asset={CAMP_WORLD_ASSETS.quest_board}
                alt=""
                width={120}
                height={72}
                renderMode="icon"
                className="h-16 w-24 object-cover object-center drop-shadow-md"
              />
            </div>
            <DailyQuestBoard
              daily={data.quests.daily}
              weekly={data.quests.weekly}
              variant="camp"
              streakDays={data.stats.currentStreak}
            />
          </CampScenePanel>

          <CampScenePanel
            open={shrineOpen}
            onClose={() => setShrineOpen(false)}
            title="Streak Shrine"
            description="Consistency grows the shrine — never pressure, only progress."
            className="bottom-[42%] left-[2%]"
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
                    renderMode="icon"
                    className="h-12 w-10 object-cover object-center"
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
        </div>
      </div>

      {chestReward ? (
        <ChestOpenCeremony reward={chestReward} onClose={() => setChestReward(null)} />
      ) : null}
    </IllustratedScreen>
  );
}
