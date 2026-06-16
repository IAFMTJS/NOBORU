"use client";

import Link from "next/link";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import {
  GlassSurfaceCardButton,
  GlassSurfacePanel,
} from "@/components/visual/primitives/glass-surface";
import { TabScene } from "@/components/visual/shells/viewport-background";
import { cn } from "@/lib/utils";

const STUDY_LINKS = [
  { label: "Review", href: "/review", icon: "icons/icon_node_review" },
  { label: "Vocabulary", href: "/learn/vocabulary", icon: "icons/icon_node_vocabulary" },
  { label: "Kanji", href: "/learn/kanji", icon: "icons/icon_node_kanji" },
  { label: "Grammar", href: "/learn/grammar", icon: "icons/icon_node_grammar" },
  { label: "Listening", href: "/learn/listening", icon: "icons/icon_node_listening" },
  { label: "Games", href: "/games", icon: "icons/icon_node_game" },
  { label: "Trials", href: "/trials", icon: "icons/icon_node_trial" },
] as const;

function StudyHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={cn("font-sans text-section-header font-semibold tracking-tight", className)}>
      {children}
    </h1>
  );
}

export function DojoScreen() {
  return (
    <TabScene className="flex min-h-full flex-col gap-4 p-4 pb-nav-clearance">
      <GlassSurfacePanel variant="hud" className="flex items-center gap-3 px-3 py-2">
        <ArtLibraryImage themedBase="icons/icon_nav_dojo_torii" src="" alt="" width={32} height={32} />
        <div>
          <StudyHeading>Study</StudyHeading>
          <p className="text-caption text-muted-foreground">Practice on the trail</p>
        </div>
      </GlassSurfacePanel>

      <nav className="grid grid-cols-2 gap-2">
        {STUDY_LINKS.map(({ label, href, icon }) => (
          <Link key={href} href={href} className="focus-ring block">
            <GlassSurfaceCardButton padding="md" className="h-full w-full flex-col gap-2">
              <ArtLibraryImage themedBase={icon} src="" alt="" width={44} height={44} className="drop-shadow-md" />
              <span className="text-caption font-semibold">{label}</span>
            </GlassSurfaceCardButton>
          </Link>
        ))}
      </nav>

      <GlassSurfacePanel variant="card">
        <p className="text-body-sm text-muted-foreground">
          Pick a discipline to train — each path reinforces your climb on the world tree.
        </p>
      </GlassSurfacePanel>
    </TabScene>
  );
}
