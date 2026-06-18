"use client";

import { PrototypeHeading } from "@/features/prototype/components/prototype-typography";
import { ArtLibraryImage } from "@/features/prototype/components/art-library-image";
import {
  PrototypeGlassButton,
  PrototypeGlassCard,
  PrototypeGlassPanel,
  prototypeGlass,
} from "@/features/prototype/components/prototype-glass-panel";
import { PrototypeTabScene } from "@/features/prototype/components/prototype-viewport-background";
import {
  MOCK_ACHIEVEMENTS,
  MOCK_COMPONENT_ICONS,
} from "@/features/prototype/constants/mock-data";
import { cn } from "@/lib/utils";

export function PrototypeComponentsTab() {
  return (
    <PrototypeTabScene className="space-y-6 p-4 pb-10">
      <section>
        <PrototypeHeading as="h2" className="mb-3">
          Glass & buttons
        </PrototypeHeading>
        <div className="space-y-3">
          <PrototypeGlassPanel variant="card">
            <p className="text-body-sm text-muted-foreground">
              Parchment-lacquer glass — frosted white, soft inset highlight, doc 08.
            </p>
          </PrototypeGlassPanel>
          <div className="flex flex-wrap gap-2">
            <PrototypeGlassButton className="flex-1">Primary</PrototypeGlassButton>
            <PrototypeGlassButton variant="secondary" fullWidth={false} className="px-5">
              Secondary
            </PrototypeGlassButton>
            <PrototypeGlassButton variant="ghost" fullWidth={false} className="px-5">
              Ghost
            </PrototypeGlassButton>
          </div>
        </div>
      </section>

      <section>
        <PrototypeHeading as="h2" className="mb-3">
          Navigation icons
        </PrototypeHeading>
        <div className="grid grid-cols-5 gap-3">
          {MOCK_COMPONENT_ICONS.slice(0, 5).map((icon) => (
            <PrototypeGlassCard
              key={icon.id}
              padding="sm"
              className="flex flex-col items-center gap-1"
            >
              <ArtLibraryImage themedBase={icon.base} src="" alt="" width={36} height={36} />
              <span className="text-[10px] text-muted-foreground">{icon.id}</span>
            </PrototypeGlassCard>
          ))}
        </div>
      </section>

      <section>
        <PrototypeHeading as="h2" className="mb-3">
          Lesson node icons
        </PrototypeHeading>
        <div className="flex flex-wrap gap-4">
          {MOCK_COMPONENT_ICONS.slice(5).map((icon) => (
            <div key={icon.id} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "inline-flex rounded-full border border-white/55 bg-white/50 p-1 backdrop-blur-md",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
                )}
              >
                <ArtLibraryImage themedBase={icon.base} src="" alt="" width={52} height={52} />
              </span>
              <span className="text-caption text-muted-foreground">{icon.id}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <PrototypeHeading as="h2" className="mb-3">
          Achievements
        </PrototypeHeading>
        <div className="grid grid-cols-3 gap-3">
          {MOCK_ACHIEVEMENTS.map((badge) => (
            <PrototypeGlassCard
              key={badge.id}
              className="flex flex-col items-center gap-2"
            >
              <ArtLibraryImage themedBase={badge.base} src="" alt="" width={64} height={64} />
              <span className="text-center text-caption font-medium">{badge.label}</span>
            </PrototypeGlassCard>
          ))}
        </div>
      </section>

      <section>
        <PrototypeHeading as="h2" className="mb-3">
          Background flavors
        </PrototypeHeading>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["backgrounds/core/bg_core", "Core"],
              ["backgrounds/study/bg_study_sakura", "Study sakura"],
              ["backgrounds/camp/bg_camp_lantern", "Camp lanterns"],
              ["backgrounds/shrine/bg_shrine", "Shrine"],
            ] as const
          ).map(([base, label]) => (
            <PrototypeGlassCard key={base} padding="sm" className="overflow-hidden p-0">
              <ArtLibraryImage themedBase={base} src="" alt="" className="aspect-[9/16] w-full object-cover" />
              <p className="px-2 py-1 text-caption">{label}</p>
            </PrototypeGlassCard>
          ))}
        </div>
      </section>
      </PrototypeTabScene>
  );
}
