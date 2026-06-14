import Image from "next/image";

import { StoryTitle } from "@/components/visual/story-title";
import { getHubArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";
import {
  CONTENT_HUB_BANNER_STYLES,
  CONTENT_HUB_ICONS,
  type ContentHubVariant,
} from "@/lib/design-system/content-hub-tokens";

export type { ContentHubVariant } from "@/lib/design-system/content-hub-tokens";

const HUB_ART_SLUG: Record<ContentHubVariant, string> = {
  vocabulary: "vocabulary",
  grammar: "grammar",
  kanji: "kanji",
  reading: "reading",
  listening: "listening",
  hiragana: "hiragana",
  katakana: "katakana",
};

type ContentHubBannerProps = {
  variant: ContentHubVariant;
  title: string;
  subtitle: string;
  className?: string;
};

export function ContentHubBanner({
  variant,
  title,
  subtitle,
  className,
}: ContentHubBannerProps) {
  const styles = CONTENT_HUB_BANNER_STYLES[variant];
  const hubArt = getHubArtPath(HUB_ART_SLUG[variant]);

  return (
    <div
      className={cn(
        "relative min-h-[5.5rem] overflow-hidden rounded-2xl border shadow-elevation-1",
        styles.border,
        className,
      )}
    >
      {hubArt ? (
        <Image
          src={hubArt}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 640px"
        />
      ) : (
        <div className={cn("absolute inset-0 bg-gradient-to-br", styles.gradient)} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/75 to-background/50" />
      <div className="relative flex items-center gap-4 p-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-card/80 font-japanese text-heading-4 text-primary shadow-elevation-1"
          aria-hidden
        >
          {CONTENT_HUB_ICONS[variant]}
        </div>
        <div className="min-w-0">
          <StoryTitle as="h3" className="text-lg">
            {title}
          </StoryTitle>
          <p className="text-body-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
