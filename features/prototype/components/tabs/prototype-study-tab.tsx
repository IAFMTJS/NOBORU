"use client";

import { PrototypeHeading } from "@/features/prototype/components/prototype-typography";
import { ArtLibraryImage } from "@/features/prototype/components/art-library-image";
import {
  PrototypeGlassButton,
  PrototypeGlassPanel,
} from "@/features/prototype/components/prototype-glass-panel";
import { PrototypeMascot, PrototypeMascotStage } from "@/features/prototype/components/prototype-mascot";
import { PrototypeTabScene } from "@/features/prototype/components/prototype-viewport-background";
import { MOCK_STUDY_LESSON } from "@/features/prototype/constants/mock-data";

export function PrototypeStudyTab() {
  return (
    <PrototypeTabScene className="flex h-full min-h-full flex-col p-4 pb-nav-clearance">
        <PrototypeGlassPanel variant="hud" className="mb-4 flex items-center gap-3 px-3 py-2">
          <ArtLibraryImage
            themedBase="icons/icon_nav_dojo_torii"
            src=""
            alt=""
            width={32}
            height={32}
          />
          <div>
            <PrototypeHeading as="h2">Study</PrototypeHeading>
            <p className="text-caption text-muted-foreground">{MOCK_STUDY_LESSON.subtitle}</p>
          </div>
        </PrototypeGlassPanel>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-col items-center justify-center gap-4 py-2">
            <PrototypeGlassPanel variant="card" className="w-full max-w-sm text-center">
              <ArtLibraryImage
                themedBase="icons/icon_node_kanji"
                src=""
                alt=""
                width={56}
                height={56}
                className="mx-auto mb-3"
              />
              <p className="font-japanese text-5xl font-semibold text-foreground">
                {MOCK_STUDY_LESSON.previewKanji}
              </p>
              <p className="mt-1 text-body-sm text-muted-foreground">{MOCK_STUDY_LESSON.previewReading}</p>
              <p className="mt-4 text-body-sm leading-relaxed text-foreground/80">
                {MOCK_STUDY_LESSON.description}
              </p>
              <div className="mt-4 flex justify-center gap-4 text-caption text-trail-glow">
                <span>{MOCK_STUDY_LESSON.duration}</span>
                <span>{MOCK_STUDY_LESSON.xp} XP</span>
              </div>
            </PrototypeGlassPanel>
          </div>

          <PrototypeMascotStage layout="ambient">
            <PrototypeMascot
              themedBase="characters/kitsune/reactions/kitsune_thinking"
              layout="ambient"
            />
          </PrototypeMascotStage>
        </div>

        <PrototypeGlassButton>Start lesson</PrototypeGlassButton>
    </PrototypeTabScene>
  );
}
