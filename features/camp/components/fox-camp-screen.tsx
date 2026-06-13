"use client";

import { useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { NextUnlockPreview } from "@/components/progression/next-unlock-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanionBadge } from "@/features/companion/components/companion-badge";
import { CollectibleGallery } from "@/features/collectibles/components/collectible-gallery";
import { ChestOpenCeremony } from "@/features/chests/components/chest-open-ceremony";
import type { ChestClaimResult } from "@/features/chests/types/chest.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import type { CampDashboardViewModel } from "@/features/camp/types/camp.types";

type FoxCampScreenProps = {
  data: CampDashboardViewModel;
};

export function FoxCampScreen({ data }: FoxCampScreenProps) {
  const [chestReward, setChestReward] = useState<ChestClaimResult | null>(null);
  const [claiming, setClaiming] = useState(false);

  const eligibleChests = data.chests.filter((c) => c.eligible);

  async function claimChest(slug: string) {
    setClaiming(true);
    try {
      const res = await fetch("/api/chests/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chestSlug: slug }),
      });
      const payload = (await res.json()) as {
        success: boolean;
        data?: ChestClaimResult;
      };
      if (payload.success && payload.data) {
        setChestReward(payload.data);
      }
    } finally {
      setClaiming(false);
    }
  }

  return (
    <PageContainer>
      <ScreenHeader
        title="Fox Camp"
        subtitle="Your base camp — trophies, relics, and Yama"
      />

      <Card className="border-primary/20 shadow-elevation-1">
        <CardContent className="p-4">
          <YamaPresence
            presence={yamaService.resolveHomePresence({
              dailyQuestsCompleted: 0,
              dailyQuestsTotal: 0,
              regionProgressPercent: 50,
              hasInProgressTrailNode: false,
            })}
            size="lg"
            layout="vertical"
          />
          <div className="mt-3">
            <CompanionBadge companion={data.companion} />
          </div>
        </CardContent>
      </Card>

      {data.preview.primaryUnlock ? (
        <NextUnlockPreview unlock={data.preview.primaryUnlock} />
      ) : null}

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Chests</CardTitle>
          <CardDescription>Deterministic rewards — no surprises, just ceremony.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {eligibleChests.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No chests ready right now.</p>
          ) : (
            eligibleChests.map((entry) => (
              <Button
                key={entry.chest.slug}
                className="w-full"
                loading={claiming}
                onClick={() => void claimChest(entry.chest.slug)}
              >
                Open {entry.chest.title}
              </Button>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Collectibles</CardTitle>
          <CardDescription>
            {data.collectibles.filter((c) => c.earned).length}/{data.collectibles.length} collected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CollectibleGallery collectibles={data.collectibles} />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Shrine Protection</CardTitle>
          <CardDescription>Calm streak insurance — earned, never purchased.</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">
            {data.shrineProtection.tokensAvailable} protection
            {data.shrineProtection.tokensAvailable === 1 ? "" : "s"} stored
          </Badge>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Trophies</CardTitle>
          <CardDescription>
            {data.achievementCount} recent achievements · {data.currentStreak}-day streak
          </CardDescription>
        </CardHeader>
      </Card>

      {chestReward ? (
        <ChestOpenCeremony
          reward={chestReward}
          onClose={() => setChestReward(null)}
        />
      ) : null}
    </PageContainer>
  );
}
