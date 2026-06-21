"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  Sheet,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet";
import {
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { WorldLessonNode } from "@/components/visual/world/world-lesson-node";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import type { LessonSummaryViewModel } from "@/features/learning/types/lesson.types";
import type { TrailNodeViewModel } from "@/features/learning/types/trail.types";
import { cn } from "@/lib/utils";

type UnlockRequirement = {
  label: string;
  completed: boolean;
};

type LessonNodeDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: TrailNodeViewModel | null;
  lesson: LessonSummaryViewModel | null;
  lessonNumber: number | null;
  lessonCount: number;
  regionName: string;
  unlockRequirements?: UnlockRequirement[];
  nextLessonLabel?: string | null;
  /** Draft CMS lesson — show coming soon instead of lock/progression messaging. */
  isComingSoon?: boolean;
  /** Hide illustrated node art in the detail sheet. */
  skeletonMode?: boolean;
};

function LessonPreviewRow({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {labels.map((label) => (
        <span
          key={label}
          lang="ja"
          className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-background px-2 font-japanese text-heading-6 text-foreground shadow-elevation-1"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

const detailSectionClass =
  "rounded-2xl border border-border bg-muted/80 p-4 shadow-elevation-1";

function UnlockChecklist({ items }: { items: UnlockRequirement[] }) {
  if (items.length === 0) return null;

  return (
    <div className={cn(detailSectionClass, "space-y-2 text-left")}>
      <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
        Way to unlock
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-body-sm">
            <UiIconImage
              name={item.completed ? "check" : "lock"}
              size={16}
              className={item.completed ? "text-success" : "text-muted-foreground"}
            />
            <span className={item.completed ? "text-muted-foreground line-through" : ""}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Doc 12 Screen 02 — in-trail lesson entry overlay; mockup node detail hierarchy. */
export function LessonNodeDetailSheet({
  open,
  onOpenChange,
  node,
  lesson,
  lessonNumber,
  lessonCount,
  regionName,
  unlockRequirements = [],
  nextLessonLabel = null,
  isComingSoon = false,
  skeletonMode = false,
}: LessonNodeDetailSheetProps) {
  const [previewLabels, setPreviewLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !lesson?.id || lesson.contentStatus === "draft") {
      setPreviewLabels([]);
      return;
    }

    let cancelled = false;

    void fetch(`/api/learning/lessons/${lesson.id}/preview`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { data?: { labels?: string[] } } | null) => {
        if (!cancelled) {
          setPreviewLabels(payload?.data?.labels ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setPreviewLabels([]);
      });

    return () => {
      cancelled = true;
    };
  }, [open, lesson?.id]);

  if (!node) return null;

  const locked = node.state === "locked" || !node.href;
  const showComingSoon = isComingSoon || lesson?.contentStatus === "draft";
  const lessonLabel =
    lessonNumber && lessonCount > 0
      ? `Lesson ${lessonNumber} of ${lessonCount}`
      : null;
  const isCheckpoint = node.nodeKind === "checkpoint";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="overlay-scrim backdrop-blur-sm" />
        <SheetPrimitive.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[min(92dvh,40rem)] overflow-hidden rounded-t-3xl border border-white/12 bg-black/40 p-0 shadow-elevation-3 backdrop-blur-md",
            "motion-reduce:animate-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          )}
        >
          <SheetPrimitive.Close className="focus-ring absolute right-4 top-4 z-20 rounded-full border border-border bg-background p-1.5 text-muted-foreground shadow-elevation-1 transition-colors hover:text-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>

          <div className="min-h-[20rem]">
            <div className="space-y-4 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <div className="flex flex-col items-center gap-3 text-center">
                {skeletonMode ? (
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold",
                      locked
                        ? "border-muted-foreground/40 text-muted-foreground"
                        : "border-primary/70 text-primary",
                    )}
                    aria-hidden
                  >
                    {isCheckpoint ? "C" : "L"}
                  </span>
                ) : (
                  <WorldLessonNode
                    state={node.state}
                    nodeKind={node.nodeKind}
                    lessonType={lesson?.type}
                    size="lg"
                  />
                )}
                <div className="space-y-1">
                  <StoryTitle as="h2" className="text-xl">
                    {node.label}
                  </StoryTitle>
                  <p className="text-caption text-muted-foreground">
                    {regionName}
                    {lessonLabel ? ` · ${lessonLabel}` : ""}
                    {node.subtitle ? ` · ${node.subtitle}` : ""}
                  </p>
                </div>
                {locked ? (
                  skeletonMode ? null : (
                    <YamaPresence
                      presence={yamaService.resolveEmptyPresence("trail")}
                      size="sm"
                      layout="vertical"
                      className="items-center"
                    />
                  )
                ) : isCheckpoint ? (
                  skeletonMode ? null : (
                    <YamaPresence
                      presence={yamaService.resolveCheckpointPresence(node.state === "completed")}
                      size="sm"
                      layout="vertical"
                      className="items-center"
                    />
                  )
                ) : skeletonMode ? null : (
                  <YamaPresence
                    presence={yamaService.resolveLessonIntroPresence()}
                    size="sm"
                    layout="vertical"
                    className="items-center"
                  />
                )}
              </div>

              {(previewLabels.length > 0 || lesson?.description) && !locked && (
                <div className={cn(detailSectionClass, "space-y-3 text-center")}>
                  {previewLabels.length > 0 ? (
                    <LessonPreviewRow labels={previewLabels} />
                  ) : null}
                  {lesson?.description ? (
                    <p className="text-body-sm text-foreground/90">{lesson.description}</p>
                  ) : null}
                </div>
              )}

              {locked ? (
                <>
                  <div className={cn(detailSectionClass, "text-center")}>
                    <div className="mb-2 flex justify-center">
                      <UiIconImage name="lock" size={24} className="opacity-80" />
                    </div>
                    <p className="text-body-sm text-foreground/90">
                      {showComingSoon
                        ? "This lesson is planned for a future update. Keep climbing the main path — new content will appear here when it is ready."
                        : "This lesson is locked. Complete the lessons below to continue your climb."}
                    </p>
                  </div>
                  <UnlockChecklist items={unlockRequirements} />
                </>
              ) : (
                <div
                  className={cn(
                    detailSectionClass,
                    "flex flex-wrap items-center justify-center gap-4 p-3 text-body-sm",
                  )}
                >
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <UiIconImage name="trophy" size={14} />
                    <span className="font-medium text-trail-glow">+{node.xpReward} XP</span>
                  </span>
                  {lesson?.estimatedDuration ? (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <UiIconImage name="clock" size={14} />
                      <span>{lesson.estimatedDuration} min</span>
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <UiIconImage name="gem" size={14} />
                    <span>Rewards on complete</span>
                  </span>
                </div>
              )}

              {locked ? (
                <PrimaryClimbButton variant="outline" className="w-full" disabled>
                  {showComingSoon ? "Coming soon" : "Locked — keep climbing"}
                </PrimaryClimbButton>
              ) : (
                <div className="space-y-2">
                  <PrimaryClimbButton className="w-full" asChild>
                    <AnalyticsLink
                      href={node.href!}
                      eventName="trail_continue_clicked"
                      eventProperties={{
                        source: "learn_node_detail",
                        lessonTitle: node.label,
                      }}
                    >
                      {isCheckpoint
                        ? node.state === "completed"
                          ? "Review exam"
                          : "Start Lesson"
                        : node.state === "completed"
                          ? "Review lesson"
                          : "Start Lesson"}
                    </AnalyticsLink>
                  </PrimaryClimbButton>
                  <Link
                    href="/review"
                    className={cn(
                      "focus-ring flex h-11 w-full items-center justify-center gap-2 font-sans text-body-sm font-medium",
                      glassSurface.buttonSecondary,
                    )}
                  >
                    <UiIconImage name="zap" size={16} />
                    Practice instead
                  </Link>
                </div>
              )}

              {nextLessonLabel && !locked ? (
                <div className={cn(detailSectionClass, "flex items-center justify-between gap-2 p-3 text-left")}>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Next up
                    </p>
                    <p className="text-body-sm font-medium">{nextLessonLabel}</p>
                  </div>
                  <UiIconImage name="chevron_down" size={14} className="rotate-[-90deg] opacity-60" />
                </div>
              ) : null}
            </div>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}
