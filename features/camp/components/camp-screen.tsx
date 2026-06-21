"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import {
  GlassSurfaceButton,
  GlassSurfaceCard,
  GlassSurfaceCardButton,
  GlassSurfaceChip,
  GlassSurfacePanel,
  glassSurface,
} from "@/components/visual/primitives/glass-surface";
import { TabScene } from "@/components/visual/shells/viewport-background";
import { DailyQuestBoard } from "@/features/gamification/components/daily-quest-board";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import { ChestOpenCeremony } from "@/features/chests/components/chest-open-ceremony";
import type { ChestClaimResult } from "@/features/chests/types/chest.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { cn } from "@/lib/utils";

type CampScreenProps = {
  data: HomeDashboardViewModel;
};

function CampHeading({
  as: Tag = "h2",
  className,
  children,
}: {
  as?: "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("font-sans text-section-header font-semibold tracking-tight", className)}>
      {children}
    </Tag>
  );
}

export function CampScreen({ data }: CampScreenProps) {
  const [questBoardOpen, setQuestBoardOpen] = useState(false);
  const [shrineOpen, setShrineOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [chestReward, setChestReward] = useState<ChestClaimResult | null>(null);
  const [collectedThisSession, setCollectedThisSession] = useState(false);

  const yama = data.yama;

  const eligibleChests = useMemo(
    () => data.chests.filter((entry) => entry.eligible),
    [data.chests],
  );

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
    <TabScene className="flex min-h-full flex-col gap-4 p-4 pb-nav-clearance">
      <GlassSurfacePanel variant="hud" className="flex items-center justify-between gap-2 px-3 py-2">
        <div>
          <CampHeading>Camp</CampHeading>
          <p className="text-caption text-muted-foreground">{data.greeting}</p>
        </div>
        <div className="flex gap-1">
          <GlassSurfaceChip>
            <ArtLibraryImage themedBase="icons/icon_ui_flame_streak" src="" alt="" width={14} height={14} />
            {data.stats.currentStreak}
          </GlassSurfaceChip>
          <GlassSurfaceChip>
            <ArtLibraryImage themedBase="icons/icon_ui_gem" src="" alt="" width={14} height={14} />
            {Math.max(0, Math.round(data.stats.totalXp / 120))}
          </GlassSurfaceChip>
        </div>
      </GlassSurfacePanel>

      <div className="flex justify-center py-2">
        <YamaPresence presence={yama} size="lg" layout="vertical" showMessage={false} />
      </div>

      <GlassSurfacePanel variant="card">
        <p className="mb-3 font-japanese text-body text-foreground/90">{data.yama.message}</p>
        <div className="grid grid-cols-2 gap-2">
          <GlassSurfaceCardButton padding="md" onClick={() => setQuestBoardOpen(true)}>
            <ArtLibraryImage themedBase="icons/icon_quest_board_pin" src="" alt="" width={40} height={40} />
            <span className="text-caption font-semibold">Quest board</span>
          </GlassSurfaceCardButton>
          <GlassSurfaceCardButton padding="md" onClick={() => setShrineOpen(true)}>
            <ArtLibraryImage themedBase="props/item_stone_lantern" src="" alt="" width={40} height={40} />
            <span className="text-caption font-semibold">Shrine</span>
          </GlassSurfaceCardButton>
        </div>
      </GlassSurfacePanel>

      <div className="grid grid-cols-2 gap-2 text-body-sm">
        <GlassSurfaceCard padding="sm">
          <p className="text-caption text-muted-foreground">Level</p>
          <p className="font-medium">{data.level.label}</p>
        </GlassSurfaceCard>
        <GlassSurfaceCard padding="sm">
          <p className="text-caption text-muted-foreground">Daily goal</p>
          <p className="font-medium">{data.dailyGoal.label}</p>
        </GlassSurfaceCard>
      </div>

      <div className="space-y-2">
        <CampHeading as="h3" className="px-1 text-body">
          Daily quests
        </CampHeading>
        {data.quests.daily.quests.slice(0, 4).map((quest) => (
          <GlassSurfaceCard key={quest.id} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{quest.title}</p>
              <p className="text-caption text-muted-foreground">
                {quest.completed ? "Complete" : `${quest.current}/${quest.target}`}
              </p>
            </div>
            <span className="shrink-0 text-caption font-semibold text-xp-gold">{quest.epReward} EP</span>
          </GlassSurfaceCard>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {eligibleChests.length > 0 && !collectedThisSession ? (
          <GlassSurfaceButton disabled={claiming} onClick={() => void claimChest()}>
            {claiming ? "Opening…" : "Open reward chest"}
          </GlassSurfaceButton>
        ) : null}
        <Link
          href="/tree"
          className={cn(
            "focus-ring motion-button flex h-11 w-full items-center justify-center px-5 font-sans text-body-sm",
            glassSurface.buttonSecondary,
          )}
        >
          Return to trail
        </Link>
        <Link
          href="/shop"
          className={cn(
            "focus-ring motion-button flex h-11 w-full items-center justify-center px-5 font-sans text-body-sm",
            glassSurface.buttonSecondary,
          )}
        >
          Shop
        </Link>
        <Link
          href="/memory-book"
          className={cn(
            "focus-ring motion-button flex h-11 w-full items-center justify-center px-5 font-sans text-body-sm",
            glassSurface.buttonGhost,
          )}
        >
          Memory book
        </Link>
      </div>

      <Dialog open={questBoardOpen} onOpenChange={setQuestBoardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quest board</DialogTitle>
            <DialogDescription>{data.dailyGoal.label}</DialogDescription>
          </DialogHeader>
          <DailyQuestBoard
            daily={data.quests.daily}
            weekly={data.quests.weekly}
            variant="compact"
            streakDays={data.stats.currentStreak}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={shrineOpen} onOpenChange={setShrineOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Streak shrine</DialogTitle>
            <DialogDescription>
              {data.stats.currentStreak} day streak — {data.shrineProtection.tokensAvailable}{" "}
              protection token{data.shrineProtection.tokensAvailable === 1 ? "" : "s"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            {([7, 14, 30, 50] as const).map((milestone) => (
              <Badge key={milestone} variant={data.stats.currentStreak >= milestone ? "default" : "outline"}>
                {milestone}d
              </Badge>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {chestReward ? (
        <ChestOpenCeremony reward={chestReward} onClose={() => setChestReward(null)} />
      ) : null}
    </TabScene>
  );
}
