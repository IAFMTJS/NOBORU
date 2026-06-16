"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage, type UiIconName } from "@/components/media/ui-icon-image";
import { Badge } from "@/components/ui/badge";
import { IllustratedScreen } from "@/components/visual/illustrated-screen";
import { CampCampfire, type CampfireIntensity } from "@/components/visual/world/camp-campfire";
import { CampFoxIdle } from "@/components/visual/world/camp-fox-idle";
import { CampQuestBoardHotspot } from "@/components/visual/world/camp-quest-board-hotspot";
import {
  CampRewardChest,
  type CampRewardChestState,
} from "@/components/visual/world/camp-reward-chest";
import {
  CampShrineHotspot,
  resolveShrineLanternAsset,
} from "@/components/visual/world/camp-shrine-hotspot";
import { CampWeatherOverlay } from "@/components/visual/world/camp-weather-overlay";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { WorldDialogueBubble } from "@/components/visual/world-dialogue-bubble";
import { ChestOpenCeremony } from "@/features/chests/components/chest-open-ceremony";
import type { ChestClaimResult } from "@/features/chests/types/chest.types";
import { DailyQuestBoard } from "@/features/gamification/components/daily-quest-board";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
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
        className="absolute inset-0 z-40 bg-black/25"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal
        aria-labelledby="camp-scene-panel-title"
        aria-describedby="camp-scene-panel-description"
        className={cn(
          "absolute z-50 w-[min(100%,20rem)] overflow-hidden rounded-card border border-white/15 shadow-elevation-2",
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
              <span className="text-sm leading-none">×</span>
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
        "focus-ring group absolute inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/55 px-2 py-1 backdrop-blur-md transition hover:scale-[1.02] hover:bg-black/65 active:scale-[0.98]",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 rounded-full bg-black/35 p-1 drop-shadow-lg transition group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]",
          glow && "trail-glow-warm",
        )}
      >
        <WorldArtImage
          asset={asset}
          alt=""
          width={22}
          height={22}
          renderMode="icon"
          className="h-5 w-5 object-cover object-center"
        />
      </div>
      <span className="truncate text-[10px] font-semibold tracking-wide text-white/90">{label}</span>
    </Link>
  );
}

type CampRailItemProps = {
  label: string;
  description: string;
  icon: UiIconName;
  active?: boolean;
  onClick?: () => void;
  href?: string;
};

function CampRailItem({
  label,
  description,
  icon,
  active = false,
  onClick,
  href,
}: CampRailItemProps) {
  const className = cn(
    "focus-ring flex w-full items-start gap-2 rounded-xl border px-2 py-2 text-left transition",
    active
      ? "border-amber-400/35 bg-amber-500/10 text-amber-100"
      : "border-white/10 bg-black/55 text-white/85 hover:bg-black/70",
  );
  const content = (
    <>
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/10">
        <UiIconImage name={icon} size={11} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[10px] font-semibold uppercase tracking-wide">{label}</span>
        <span className="line-clamp-2 text-[9px] leading-snug text-white/65">{description}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
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
  const pseudoGemCount = Math.max(0, Math.round(data.stats.totalXp / 120));

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
      className="min-h-full"
      background={
        <SceneImage
          scene="camp_base"
          alt="Mountain camp at dusk"
          className="absolute inset-0 min-h-full rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-full flex-col">
        <CampWeatherOverlay enabled />
        <div className="absolute inset-0 bg-gradient-to-b from-black/62 via-black/20 to-black/76" aria-hidden />

        <header className="relative z-10 flex items-start justify-between gap-3 px-3 pt-3">
          <div className="w-[64%] rounded-2xl border border-white/10 bg-black/50 p-2.5 backdrop-blur-sm">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20 ring-1 ring-amber-300/30">
                <UiIconImage name="mountain" size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-amber-100">{playerName}</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">{data.level.label}</p>
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-300"
                style={{ width: `${Math.max(6, data.elevation.progressPercent)}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center justify-end gap-1 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-caption font-semibold tabular-nums text-trail-glow backdrop-blur-sm">
              <UiIconImage name="flame" size={13} />
              {data.stats.currentStreak}
            </span>
            <span className="inline-flex items-center justify-end gap-1 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-caption font-semibold tabular-nums text-violet-200 backdrop-blur-sm">
              <UiIconImage name="gem" size={13} />
              {pseudoGemCount}
            </span>
          </div>
        </header>

        <div className="relative z-10 flex-1 px-3 pb-4">
          <div className="grid h-full grid-cols-[8.25rem_1fr_7.5rem] gap-2">
            <div className="pt-3">
              {!scenePanelOpen ? (
                <aside className="space-y-1.5">
                  <CampRailItem
                    label="Player Status"
                    description={`${data.level.label} • ${data.elevation.totalEp.toLocaleString()} EP`}
                    icon="zap"
                    active
                    href="/profile"
                  />
                  <CampRailItem
                    label="Quest Board"
                    description={data.dailyGoal.label}
                    icon="check"
                    onClick={() => setQuestBoardOpen(true)}
                  />
                  <CampRailItem
                    label="Shrine"
                    description="View streak flames and blessings."
                    icon="trophy"
                    onClick={() => setShrineOpen(true)}
                  />
                  <CampRailItem
                    label="Campfire"
                    description="Visit your companion."
                    icon="flame"
                    href={data.upcomingLesson.href}
                  />
                  <CampRailItem
                    label="Merchant"
                    description="Spend resources and upgrade."
                    icon="coins"
                    href="/shop"
                  />
                  <CampRailItem
                    label="Memory Book"
                    description="Review your journey."
                    icon="map"
                    href="/memory-book"
                  />
                </aside>
              ) : null}
            </div>

            <div className="relative">
              <CampCampfire
                intensity={campfireIntensity}
                className="absolute bottom-[30%] left-1/2 z-[1] -translate-x-1/2"
              />

              <div className="absolute bottom-[24%] left-[8%] z-10">
                <CampFoxIdle />
              </div>

              <CampRewardChest
                className="bottom-[17%] left-[24%]"
                state={chestState}
                disabled={claiming}
                onClick={() => void claimChest()}
              />

              {!scenePanelOpen ? (
                <div className="absolute bottom-[36%] left-[24%] z-20 max-w-[7.5rem] rounded-xl border border-white/10 bg-black/55 px-2 py-1.5 backdrop-blur-sm">
                  <p className="text-[10px] text-white/85">{data.yama.message}</p>
                </div>
              ) : null}

              {!scenePanelOpen ? (
                <CampQuestBoardHotspot
                  className="bottom-[42%] right-[4%]"
                  hasActiveQuests={hasActiveQuests}
                  onClick={() => setQuestBoardOpen(true)}
                />
              ) : null}

              {!scenePanelOpen ? (
                <CampShrineHotspot
                  className="bottom-[38%] left-[2%]"
                  streakDays={data.stats.currentStreak}
                  onClick={() => setShrineOpen(true)}
                />
              ) : null}

              {!scenePanelOpen ? (
                <CampWorldHotspotLink
                  label="Merchant"
                  href="/shop"
                  asset={CAMP_WORLD_ASSETS.merchant}
                  className="bottom-[26%] right-[12%]"
                />
              ) : null}

              {!scenePanelOpen ? (
                <CampWorldHotspotLink
                  label="Tent"
                  href="/profile"
                  asset={CAMP_WORLD_ASSETS.tent}
                  className="bottom-[34%] right-[28%]"
                />
              ) : null}

              {!scenePanelOpen ? (
                <CampWorldHotspotLink
                  label="Memory Book"
                  href="/memory-book"
                  asset={CAMP_WORLD_ASSETS.memory_book}
                  className="bottom-[22%] right-[30%]"
                />
              ) : null}
            </div>

            <div className="pt-3">
              {!scenePanelOpen ? (
                <div className="rounded-2xl border border-white/10 bg-black/55 p-2.5 backdrop-blur-sm">
                  <p className="text-[11px] font-semibold tracking-wide text-amber-100">Night Mode</p>
                  <p className="mt-1 text-[10px] text-white/70">
                    It&apos;s late, traveler. Rest well and come back stronger.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <CampScenePanel
            open={questBoardOpen}
            onClose={() => setQuestBoardOpen(false)}
            title="Quest Board"
            description={`Daily goals from camp — ${data.dailyGoal.label}`}
            className="bottom-[40%] right-[2%]"
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
              variant="compact"
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
