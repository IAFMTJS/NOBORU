"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { IllustratedScreen, StoryTitle } from "@/components/visual";
import { yamaService } from "@/features/yama/services/yama.service";
import { getDojoIconPath, getWorldIconPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type StudyHotspot = {
  label: string;
  href: string;
  className: string;
  icon: ReactNode;
};

const STUDY_HOTSPOTS: StudyHotspot[] = [
  {
    label: "Review",
    href: "/review",
    className: "left-1/2 top-[18%] w-[4.9rem] -translate-x-1/2 sm:w-[5.5rem]",
    icon: <StudyIcon src={getDojoIconPath("review_queue")} />,
  },
  {
    label: "Vocabulary",
    href: "/learn/vocabulary",
    className: "left-[6%] top-[30%] w-[4.5rem] sm:w-[5rem]",
    icon: <StudyIcon src={getDojoIconPath("vocabulary_hall")} />,
  },
  {
    label: "Kanji",
    href: "/learn/kanji",
    className: "right-[5%] top-[28%] w-[4.5rem] sm:w-[5rem]",
    icon: <StudyIcon src={getDojoIconPath("kanji_grounds")} />,
  },
  {
    label: "Grammar",
    href: "/learn/grammar",
    className: "left-[4%] top-[46%] w-[4.5rem] sm:w-[5rem]",
    icon: <StudyIcon src={getDojoIconPath("grammar_shrine")} />,
  },
  {
    label: "Listening",
    href: "/learn/listening",
    className: "right-[4%] top-[44%] w-[4.5rem] sm:w-[5rem]",
    icon: <StudyIcon src={getDojoIconPath("listening_pavilion")} />,
  },
  {
    label: "Games",
    href: "/games",
    className: "bottom-[30%] left-[10%] w-[4.5rem] sm:w-[5rem]",
    icon: <StudyIcon src={getWorldIconPath("games")} />,
  },
  {
    label: "Trials",
    href: "/trials",
    className: "bottom-[28%] right-[8%] w-[4.5rem] sm:w-[5rem]",
    icon: <StudyIcon src={getWorldIconPath("trials")} />,
  },
];

function StudyIcon({ src }: { src: string | null }) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={22}
      height={22}
      aria-hidden
      className="shrink-0 object-contain object-center"
    />
  );
}

type DojoHotspotProps = {
  label: string;
  href: string;
  className: string;
  icon: ReactNode;
};

function DojoHotspot({ label, href, className, icon }: DojoHotspotProps) {
  return (
    <div
      className={cn(
        "absolute rounded-xl border border-white/12 bg-black/40 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-sm transition-colors hover:border-trail-glow/40",
        className,
      )}
    >
      <Link
        href={href}
        className="focus-ring flex min-h-11 flex-col items-center justify-center gap-1 px-2 py-2 text-center"
        aria-label={label}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-white/10"
          aria-hidden
        >
          {icon}
        </span>
        <span className="text-[10px] font-semibold tracking-wide text-foreground/90">
          {label}
        </span>
      </Link>
    </div>
  );
}

export function DojoScreen() {
  const presence = yamaService.resolveNavPresence("study", 0);

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="study_atmosphere"
          alt="Forest trail study area at night"
          className="absolute inset-0 min-h-dvh rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/65"
          aria-hidden
        />

        <header className="relative z-10 p-4 pt-3">
          <div className="space-y-1 rounded-card border border-white/12 bg-black/45 p-3 backdrop-blur-sm">
            <StoryTitle as="h1" className="text-base">
              Study
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Travel study areas — practice while on the trail
            </p>
          </div>
        </header>

        <div className="relative z-10 flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="absolute bottom-[18%] left-[14%] max-w-[9rem]">
            <YamaPresence presence={presence} size="md" layout="vertical" showMessage={false} />
          </div>

          {STUDY_HOTSPOTS.map((spot) => (
            <DojoHotspot
              key={spot.href}
              label={spot.label}
              href={spot.href}
              className={spot.className}
              icon={spot.icon}
            />
          ))}
        </div>
      </div>
    </IllustratedScreen>
  );
}
