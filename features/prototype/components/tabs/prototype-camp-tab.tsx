"use client";

import { PrototypeHeading } from "@/features/prototype/components/prototype-typography";
import { ArtLibraryImage } from "@/features/prototype/components/art-library-image";
import {
  PrototypeGlassButton,
  PrototypeGlassCard,
  PrototypeGlassCardButton,
  PrototypeGlassChip,
  PrototypeGlassPanel,
} from "@/features/prototype/components/prototype-glass-panel";
import { PrototypeMascot, PrototypeMascotStage } from "@/features/prototype/components/prototype-mascot";
import { PrototypeTabScene } from "@/features/prototype/components/prototype-viewport-background";
import { MOCK_PLAYER, MOCK_QUESTS } from "@/features/prototype/constants/mock-data";

export function PrototypeCampTab() {
  return (
    <PrototypeTabScene className="flex min-h-full flex-col gap-4 p-4 pb-8 pb-nav-clearance">
        <PrototypeGlassPanel variant="hud" className="flex items-center justify-between gap-2 px-3 py-2">
          <div>
            <PrototypeHeading as="h2">Camp</PrototypeHeading>
            <p className="text-caption text-muted-foreground">Evening rest · mock data</p>
          </div>
          <div className="flex gap-1">
            <PrototypeGlassChip>
              <ArtLibraryImage themedBase="icons/icon_ui_flame_streak" src="" alt="" width={14} height={14} />
              {MOCK_PLAYER.streak}
            </PrototypeGlassChip>
            <PrototypeGlassChip>
              <ArtLibraryImage themedBase="icons/icon_ui_gem" src="" alt="" width={14} height={14} />
              {MOCK_PLAYER.gems}
            </PrototypeGlassChip>
          </div>
        </PrototypeGlassPanel>

        <PrototypeMascotStage layout="spotlight">
          <PrototypeMascot themedBase="characters/kitsune/reactions/kitsune_happy" layout="spotlight" />
        </PrototypeMascotStage>

        <PrototypeGlassPanel variant="card">
          <p className="mb-3 font-japanese text-body text-foreground/90">
            今日も一緒に登ろう — the trail waits, but the fire is warm.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <PrototypeGlassCardButton padding="md">
              <ArtLibraryImage themedBase="icons/icon_quest_board_pin" src="" alt="" width={40} height={40} />
              <span className="text-caption font-semibold">Quest board</span>
            </PrototypeGlassCardButton>
            <PrototypeGlassCardButton padding="md">
              <ArtLibraryImage themedBase="props/item_stone_lantern" src="" alt="" width={40} height={40} />
              <span className="text-caption font-semibold">Shrine</span>
            </PrototypeGlassCardButton>
          </div>
        </PrototypeGlassPanel>

        <div className="space-y-2">
          <PrototypeHeading as="h3" className="px-1">
            Daily quests
          </PrototypeHeading>
          {MOCK_QUESTS.map((quest) => (
            <PrototypeGlassCard key={quest.id} className="flex items-center gap-3">
              <ArtLibraryImage
                themedBase={quest.iconBase}
                src=""
                alt=""
                width={44}
                height={44}
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{quest.title}</p>
                <p className="text-caption text-muted-foreground">{quest.progress}</p>
              </div>
              <span className="shrink-0 text-caption font-semibold text-xp-gold">{quest.reward}</span>
            </PrototypeGlassCard>
          ))}
        </div>

        <PrototypeGlassButton>Return to trail</PrototypeGlassButton>
    </PrototypeTabScene>
  );
}
