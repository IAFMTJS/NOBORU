"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  GlassPanel,
  IllustratedScreen,
  StoryTitle,
} from "@/components/visual";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import type {
  CollectionArtifactCategory,
  CollectionArtifactViewModel,
  CollectionsMuseumViewModel,
} from "@/features/collections/types/collections.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { cn } from "@/lib/utils";

type CollectionsMuseumScreenProps = {
  museum: CollectionsMuseumViewModel;
};

const CATEGORY_TABS: Array<{ id: CollectionArtifactCategory | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "lanterns", label: "Lanterns" },
  { id: "charms", label: "Charms" },
  { id: "relics", label: "Relics" },
  { id: "trail", label: "Trail" },
  { id: "seasonal", label: "Seasonal" },
];

function ArtifactPedestal({
  artifact,
  selected,
  onSelect,
}: {
  artifact: CollectionArtifactViewModel;
  selected: boolean;
  onSelect: () => void;
}) {
  const asset = INVENTORY_ITEM_ASSETS[artifact.assetKey];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition-colors",
        selected
          ? "border-trail-glow/60 bg-trail-glow/10 shadow-[0_0_16px_hsl(var(--trail-glow)/0.2)]"
          : "border-white/15 bg-black/35 hover:border-trail-glow/30",
        !artifact.discovered && "opacity-70",
      )}
      aria-pressed={selected}
      aria-label={
        artifact.discovered
          ? `${artifact.name}, discovered in ${artifact.regionLabel}`
          : `${artifact.name}, not yet discovered`
      }
    >
      <span
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full border bg-black/40",
          artifact.discovered ? "border-trail-glow/30" : "border-white/10",
        )}
      >
        {artifact.discovered ? (
          <WorldArtImage
            asset={asset}
            alt=""
            width={48}
            height={48}
            className="drop-shadow-md"
          />
        ) : (
          <UiIconImage name="lock" size={24} className="opacity-60" />
        )}
      </span>
      <span className="line-clamp-2 text-caption font-medium text-white">
        {artifact.discovered ? artifact.name : "???"}
      </span>
    </button>
  );
}

export function CollectionsMuseumScreen({ museum }: CollectionsMuseumScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const wings = useMemo(
    () =>
      CATEGORY_TABS.filter((tab) => tab.id !== "all").map((tab) => ({
        ...tab,
        artifacts: museum.artifacts.filter((artifact) => artifact.category === tab.id),
      })),
    [museum.artifacts],
  );

  const selectedArtifact =
    museum.artifacts.find((artifact) => artifact.id === selectedId) ??
    museum.artifacts[0] ??
    null;

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="checkpoint_shrine"
          alt="Shrine hall displaying trail artifacts"
          className="absolute inset-0 min-h-dvh rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/85"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 p-4 pt-3">
          <Link
            href="/profile"
            className="mb-3 inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Profile
          </Link>

          <div className="space-y-1 rounded-card border border-white/12 bg-black/45 p-4">
            <div className="space-y-0.5">
              <StoryTitle as="h1" className="text-base">
                Collections
              </StoryTitle>
              <p className="text-caption text-muted-foreground">
                Artifacts discovered along the climb — curated, not catalogued
              </p>
            </div>
            <p className="font-story text-sm text-trail-glow tabular-nums">
              {museum.discoveredCount}/{museum.totalCount} discoveries in the exhibit hall
            </p>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2">
          <div className="mx-auto max-w-md space-y-6 pb-4">
            {museum.artifacts.length === 0 ? (
              <YamaEmptyState
                surface="generic"
                title="Exhibit hall awaits discovery"
                description="Artifacts will take their pedestals as you uncover treasures on the climb."
                actionHref="/learn"
                actionLabel="Continue climbing"
              />
            ) : (
              wings.map((wing) => (
              <section key={wing.id} aria-labelledby={`wing-${wing.id}`} className="space-y-2">
                <h2
                  id={`wing-${wing.id}`}
                  className="font-story text-sm uppercase tracking-widest text-trail-glow/90"
                >
                  {wing.label} wing
                </h2>
                {wing.artifacts.length === 0 ? (
                  <YamaEmptyState
                    surface="generic"
                    title="Wing awaits discovery"
                    description="Artifacts in this hall will appear as you explore the trail."
                    className="py-2"
                  />
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {wing.artifacts.map((artifact) => (
                      <div key={artifact.id} className="w-[7.5rem] shrink-0">
                        <ArtifactPedestal
                          artifact={artifact}
                          selected={selectedArtifact?.id === artifact.id}
                          onSelect={() => setSelectedId(artifact.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
              ))
            )}
          </div>
        </main>

        <footer className="relative z-10 shrink-0 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
          {selectedArtifact ? (
            <GlassPanel className="mx-auto max-w-md space-y-3 rounded-card p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-trail-glow/25 bg-black/40">
                  {selectedArtifact.discovered ? (
                    <WorldArtImage
                      asset={INVENTORY_ITEM_ASSETS[selectedArtifact.assetKey]}
                      alt=""
                      width={40}
                      height={40}
                    />
                  ) : (
                    <UiIconImage name="lock" size={22} className="opacity-60" />
                  )}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-story text-sm text-trail-glow">
                    {selectedArtifact.discovered ? selectedArtifact.name : "Undiscovered"}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    {selectedArtifact.regionLabel} · {selectedArtifact.category}
                  </p>
                </div>
              </div>
              <p className="text-body-sm text-muted-foreground">
                {selectedArtifact.discovered
                  ? selectedArtifact.description
                  : "Keep climbing to reveal this artifact in the museum."}
              </p>
              {selectedArtifact.discoveredAt ? (
                <p className="text-caption text-muted-foreground">
                  Discovered {new Date(selectedArtifact.discoveredAt).toLocaleDateString()}
                </p>
              ) : null}
            </GlassPanel>
          ) : (
            <GlassPanel className="mx-auto max-w-md rounded-card p-3 text-center">
              <p className="text-caption text-muted-foreground">
                Select an artifact to read its story
              </p>
            </GlassPanel>
          )}
        </footer>
      </div>
    </IllustratedScreen>
  );
}
