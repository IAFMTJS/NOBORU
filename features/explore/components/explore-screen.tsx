"use client";

import Link from "next/link";
import Image from "next/image";

import { GlassPanel, PrimaryClimbButton } from "@/components/visual";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { DISCOVER_CATEGORIES } from "@/features/discover/constants/discover-content";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { getWorldIconPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

const DISCOVER_CATEGORIES_TILES = DISCOVER_CATEGORIES.map((category) => ({
  label: category.label,
  glyph: category.glyph,
  iconSlug: category.iconSlug,
  href: `/world/discover/${category.slug}`,
}));

type ExploreScreenProps = {
  yama: YamaPresenceViewModel;
};

function DiscoverCategoryTile({
  label,
  glyph,
  iconSlug,
  href,
}: {
  label: string;
  glyph: string;
  iconSlug: string;
  href: string;
}) {
  const src = getWorldIconPath(iconSlug);
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center transition-colors",
        glassSurface.card,
        "hover:bg-white/58",
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/55 bg-primary/10">
        {src ? (
          <Image src={src} alt="" width={28} height={28} aria-hidden className="object-contain" />
        ) : (
          <span className="font-japanese text-lg text-primary" aria-hidden>
            {glyph}
          </span>
        )}
      </span>
      <span className="text-body-sm font-medium text-foreground">{label}</span>
      <span className="text-caption text-trail-glow">Read</span>
    </Link>
  );
}

/** Secondary discovery — lore and culture along the climb; not a primary hub. */
export function ExploreScreen({ yama }: ExploreScreenProps) {
  return (
    <SecondaryScreenShell
      title="Discover Japan"
      subtitle="Culture, folklore, and lore between lessons on the trail"
      backHref="/tree"
      backLabel="Journey"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-4">
        <GlassPanel className="p-4">
          <YamaPresence presence={yama} size="sm" layout="horizontal" />
        </GlassPanel>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DISCOVER_CATEGORIES_TILES.map((cat) => (
            <DiscoverCategoryTile
              key={cat.label}
              label={cat.label}
              glyph={cat.glyph}
              iconSlug={cat.iconSlug}
              href={cat.href}
            />
          ))}
        </div>

        <GlassPanel className="space-y-2 p-4">
          <div className="space-y-1">
            <h2 className="font-sans text-body font-semibold">Mountain overview</h2>
            <p className="text-caption text-muted-foreground">
              Optional map view — the main climb stays on the Journey trail.
            </p>
          </div>
          <Link
            href="/learn/world"
            className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Open world map
          </Link>
        </GlassPanel>

        <PrimaryClimbButton asChild className="mx-auto max-w-md">
          <Link href="/tree">Return to trail</Link>
        </PrimaryClimbButton>
      </div>
    </SecondaryScreenShell>
  );
}
