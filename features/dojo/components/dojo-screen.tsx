"use client";

import Image from "next/image";
import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { YamaExpressionImage } from "@/components/media/yama-expression-image";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { yamaService } from "@/features/yama/services/yama.service";
import { getDojoIconPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

const TRAINING_GROUNDS = [
  { title: "Review Queue", description: "Spaced repetition and weakness drills.", href: "/review", iconSlug: "review_queue" },
  { title: "Kana Dojo", description: "Hiragana and katakana recognition and writing.", href: "/learn/hiragana", iconSlug: "kana_dojo" },
  { title: "Vocabulary Hall", description: "Word recall, meaning, and production drills.", href: "/learn/vocabulary", iconSlug: "vocabulary_hall" },
  { title: "Grammar Shrine", description: "Pattern recognition and sentence building.", href: "/learn/grammar", iconSlug: "grammar_shrine" },
  { title: "Listening Pavilion", description: "Ear training and comprehension practice.", href: "/learn/listening", iconSlug: "listening_pavilion" },
  { title: "Kanji Grounds", description: "Readings, radicals, and stroke mastery.", href: "/learn/kanji", iconSlug: "kanji_grounds" },
  { title: "Reading Library", description: "Graded passages and comprehension checks.", href: "/learn/reading", iconSlug: "reading_library" },
] as const;

function DojoHallIcon({
  slug,
  className,
}: {
  slug: (typeof TRAINING_GROUNDS)[number]["iconSlug"];
  className?: string;
}) {
  const src = getDojoIconPath(slug);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      width={22}
      height={22}
      aria-hidden
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

function DojoHubTile({
  iconSlug,
  title,
  description,
  href,
}: {
  iconSlug: (typeof TRAINING_GROUNDS)[number]["iconSlug"];
  title: string;
  description: string;
  href: string;
}) {
  return (
    <GlassPanel className="transition-colors hover:border-trail-glow/30">
      <Link href={href} className="focus-ring block space-y-3 p-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-success/10"
            aria-hidden
          >
            <DojoHallIcon slug={iconSlug} />
          </span>
          <div className="min-w-0 space-y-1">
            <StoryTitle as="h3" className="text-sm">
              {title}
            </StoryTitle>
            <p className="text-caption text-muted-foreground">{description}</p>
          </div>
        </div>
        <p className="text-caption font-medium text-primary">Enter →</p>
      </Link>
    </GlassPanel>
  );
}

export function DojoScreen() {
  const presence = yamaService.resolveTrainingGroundsPresence("kana_dojo", 0);

  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <SceneImage
          scene="dojo_forest"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <PageContainer>
        <header className="space-y-1">
          <StoryTitle as="h1" className="text-xl">
            Dojo
          </StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Training Grounds — deliberate practice for mastery
          </p>
        </header>

        <GlassPanel className="flex items-start gap-3 p-4">
          <YamaExpressionImage
            expression="training"
            fit="sticker"
            width={72}
            height={72}
            className="h-[4.5rem] w-[4.5rem] shrink-0"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-body-sm font-medium">{presence.message}</p>
            <p className="text-caption text-muted-foreground">
              Choose a hall to begin focused practice.
            </p>
          </div>
        </GlassPanel>

        <div className="grid gap-3 sm:grid-cols-2">
          {TRAINING_GROUNDS.map((ground) => (
            <DojoHubTile
              key={ground.href}
              iconSlug={ground.iconSlug}
              title={ground.title}
              description={ground.description}
              href={ground.href}
            />
          ))}
        </div>
      </PageContainer>
    </IllustratedScreen>
  );
}
