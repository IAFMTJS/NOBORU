"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import { GlassPanel } from "@/components/visual";
import { WorldToriiGate } from "@/components/visual/world";
import { N5_PORTAL_MATTE } from "@/features/worlds/constants/n5-world-art.constants";

type N5PortalTransitionProps = {
  open: boolean;
  onStay: () => void;
};

/** N5 → N4 portal cinematic (script from docs/JWorld/06-n5-deep-dive.md). */
export function N5PortalTransition({ open, onStay }: N5PortalTransitionProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal
      aria-labelledby="n5-portal-title"
    >
      <div className="relative mx-auto max-w-sm overflow-hidden rounded-card">
        <ArtLibraryImage
          src={N5_PORTAL_MATTE[theme]}
          alt=""
          cover
          className="absolute inset-0 min-h-full opacity-40"
        />
        <GlassPanel
          variant="panel"
          className="relative space-y-5 border border-trail-glow/30 bg-background/80 p-6 text-center backdrop-blur-sm"
        >
          <div className="flex justify-center">
            <WorldToriiGate width={120} height={80} />
          </div>
          <div className="space-y-2">
            <p className="text-caption text-muted-foreground">Hajimari no Sakai · complete</p>
            <h2 id="n5-portal-title" className="text-title font-semibold text-foreground">
              The first light follows you now.
            </h2>
            <p className="text-body-sm text-muted-foreground">
              Beyond the Gate of Ascent, the forest deepens. Realm of the Green Ascent awaits.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/tree?region=n4"
              className="inline-flex h-12 items-center justify-center rounded-button bg-primary text-body font-semibold text-primary-foreground"
            >
              Step onto the bridge
            </Link>
            <button
              type="button"
              onClick={onStay}
              className="focus-ring h-11 text-body-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Stay a while
            </button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
