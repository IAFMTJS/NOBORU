"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { YamaAvatar } from "@/features/yama/components/yama-avatar";
import { useLoadingPresentation } from "@/features/yama/hooks/use-loading-presentation";
import type { LoadingPresentationInput } from "@/features/yama/types/loading.types";
import { getLoadingScenePath } from "@/lib/assets/registry";
import { resolveSceneBackgroundPresentation } from "@/lib/assets/image-presentation";
import { cn } from "@/lib/utils";

import { CampCampfire } from "./world/camp-campfire";
import { StoryTitle } from "./story-title";

type FullscreenLoadingShellProps = LoadingPresentationInput & {
  className?: string;
  /** When false, synthetic progress/message rotation is frozen. */
  animate?: boolean;
};

function LoadingBackground({
  profile,
  priority = true,
}: {
  profile: LoadingPresentationInput["profile"];
  priority?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const src = getLoadingScenePath(profile, resolvedTheme);
  const presentation = resolveSceneBackgroundPresentation();

  if (!src) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background"
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      aria-hidden
      className="object-cover object-center"
      style={{
        objectFit: presentation.objectFit,
        objectPosition: presentation.objectPosition,
      }}
      sizes="100vw"
    />
  );
}

export function FullscreenLoadingShell({
  className,
  animate = true,
  ...input
}: FullscreenLoadingShellProps) {
  const presentation = useLoadingPresentation({ ...input, animate });
  const isFullscreen = presentation.mode === "fullscreen";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={presentation.title}
      className={cn(
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col overflow-hidden bg-background"
          : "relative flex min-h-[50dvh] flex-col overflow-hidden rounded-card",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isFullscreen ? "left-1/2 w-screen max-w-none -translate-x-1/2" : "inset-x-0",
        )}
        aria-hidden
      >
        <LoadingBackground profile={presentation.profile} priority={isFullscreen} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/15 via-background/35 to-background/92" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--trail-glow)/0.14),transparent_58%)]" />
      </div>

      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col",
          isFullscreen
            ? "justify-end px-5 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-16"
            : "items-center justify-center px-6 py-12",
        )}
      >
        {isFullscreen ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-[34%] flex items-end justify-between px-6 sm:px-10">
            <div className="relative flex items-end gap-2">
              {presentation.showCampfire ? (
                <CampCampfire intensity="idle" className="scale-90 sm:scale-100" />
              ) : null}
              <YamaAvatar
                expression={presentation.expression}
                poseId={presentation.companionPoseId}
                size="xl"
                fit="full"
                alt=""
                priority
                className="h-28 w-28 sm:h-36 sm:w-36"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6 flex flex-col items-center gap-4">
            <YamaAvatar
              expression={presentation.expression}
              poseId={presentation.companionPoseId}
              size="lg"
              fit="full"
              alt=""
              priority
            />
            {presentation.showCampfire ? (
              <CampCampfire intensity="idle" className="scale-75" />
            ) : null}
          </div>
        )}

        <div
          className={cn(
            "w-full space-y-4",
            isFullscreen ? "max-w-md self-center text-center" : "max-w-sm text-center",
          )}
        >
          <div className="space-y-2">
            <StoryTitle
              as="h1"
              className={cn(
                "text-balance text-story-title text-foreground",
                isFullscreen ? "text-xl sm:text-2xl" : "text-lg",
              )}
            >
              {presentation.title}
            </StoryTitle>
            <p className="text-balance text-body-sm text-muted-foreground">
              {presentation.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-body-sm">
              <span className="text-muted-foreground">{presentation.statusMessage}</span>
              {!presentation.showSpinner ? (
                <span className="font-medium tabular-nums text-foreground">
                  {presentation.percent}%
                </span>
              ) : null}
            </div>

            {presentation.showSpinner ? (
              <div className="flex justify-center py-1">
                <Spinner
                  size="sm"
                  className="border-trail-glow/70 border-t-transparent trail-glow-warm"
                />
              </div>
            ) : (
              <Progress
                value={presentation.percent}
                aria-label={`${presentation.stageLabel} progress`}
                className="h-1.5 bg-secondary/80"
                indicatorClassName="bg-trail-glow trail-glow-warm motion-standard"
              />
            )}

            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground/80">
              {presentation.stageLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
