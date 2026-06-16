"use client";

import { PrototypeHeading } from "@/features/prototype/components/prototype-typography";
import { ArtLibraryImage } from "@/features/prototype/components/art-library-image";
import {
  PrototypeGlassButton,
  PrototypeGlassCard,
  PrototypeGlassPanel,
} from "@/features/prototype/components/prototype-glass-panel";
import { PrototypeMascot } from "@/features/prototype/components/prototype-mascot";
import { PrototypeTabScene } from "@/features/prototype/components/prototype-viewport-background";
import {
  MOCK_ACHIEVEMENTS,
  MOCK_PLAYER,
  MOCK_PROFILE_STATS,
} from "@/features/prototype/constants/mock-data";

export function PrototypeProfileTab() {
  return (
    <PrototypeTabScene className="flex flex-col gap-4 p-4 pb-nav-clearance">
        <PrototypeGlassPanel variant="card" className="flex flex-col items-center text-center">
          <PrototypeMascot
            themedBase="characters/kitsune/base/kitsune_hero_profile"
            layout="inline"
            className="mb-3"
          />
          <PrototypeHeading as="h2">{MOCK_PLAYER.displayName}</PrototypeHeading>
          <p className="text-caption text-trail-glow">Level {MOCK_PLAYER.level} · Foot Hills</p>
          <div className="mt-4 grid w-full grid-cols-2 gap-2">
            {MOCK_PROFILE_STATS.map((stat) => (
              <PrototypeGlassCard key={stat.label} padding="sm" className="text-left">
                <p className="text-caption text-muted-foreground">{stat.label}</p>
                <p className="font-semibold tabular-nums">{stat.value}</p>
              </PrototypeGlassCard>
            ))}
          </div>
        </PrototypeGlassPanel>

        <div className="space-y-2">
          <PrototypeHeading as="h3" className="px-1">
            Recent badges
          </PrototypeHeading>
          <div className="grid grid-cols-3 gap-2">
            {MOCK_ACHIEVEMENTS.map((badge) => (
              <PrototypeGlassCard
                key={badge.id}
                padding="sm"
                className="flex flex-col items-center gap-1"
              >
                <ArtLibraryImage themedBase={badge.base} src="" alt="" width={56} height={56} />
                <span className="text-center text-[10px] font-medium">{badge.label}</span>
              </PrototypeGlassCard>
            ))}
          </div>
        </div>

        <PrototypeGlassButton variant="secondary">Edit profile</PrototypeGlassButton>
    </PrototypeTabScene>
  );
}
