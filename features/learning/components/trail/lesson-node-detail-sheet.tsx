"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  Sheet,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet";
import {
  GlassPanel,
  IllustratedScreen,
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
};

function LessonPreviewRow({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {labels.map((label) => (
        <span
          key={label}
          lang="ja"
          className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-white/15 bg-black/35 px-2 font-japanese text-heading-6"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function UnlockChecklist({ items }: { items: UnlockRequirement[] }) {
  if (items.length === 0) return null;

  return (
    <GlassPanel className="space-y-2 p-4 text-left">
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
    </GlassPanel>
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
}: LessonNodeDetailSheetProps) {
  const [previewLabels, setPreviewLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !lesson?.id) {
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
  const lessonLabel =
    lessonNumber && lessonCount > 0
      ? `Lesson ${lessonNumber} of ${lessonCount}`
      : null;
  const isCheckpoint = node.nodeKind === "checkpoint";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="bg-black/50 backdrop-blur-[3px]" />
        <SheetPrimitive.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[min(92dvh,40rem)] overflow-hidden rounded-t-3xl border border-white/10 bg-transparent p-0 shadow-elevation-2",
            "motion-reduce:animate-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          )}
        >
          <SheetPrimitive.Close className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-1.5 text-white/80 ring-offset-background transition-opacity hover:text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>

          <IllustratedScreen
            scrim="minimal"
            className="min-h-[20rem] rounded-t-3xl bg-black/55 backdrop-blur-md"
            background={
              <SceneImage
                scene={isCheckpoint ? "checkpoint_shrine" : "study_atmosphere"}
                alt=""
                className="absolute inset-0 rounded-none opacity-70"
              />
            }
          >
            <div className="space-y-4 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <div className="flex flex-col items-center gap-3 text-center">
                <WorldLessonNode
                  state={node.state}
                  nodeKind={node.nodeKind}
                  lessonType={lesson?.type}
                  size="lg"
                />
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
                  <YamaPresence
                    presence={yamaService.resolveEmptyPresence("trail")}
                    size="sm"
                    layout="vertical"
                    className="items-center"
                  />
                ) : isCheckpoint ? (
                  <YamaPresence
                    presence={yamaService.resolveCheckpointPresence(node.state === "completed")}
                    size="sm"
                    layout="vertical"
                    className="items-center"
                  />
                ) : (
                  <YamaPresence
                    presence={yamaService.resolveLessonIntroPresence()}
                    size="sm"
                    layout="vertical"
                    className="items-center"
                  />
                )}
              </div>

              {(previewLabels.length > 0 || lesson?.description) && !locked && (
                <GlassPanel className="space-y-3 p-4 text-center">
                  {previewLabels.length > 0 ? (
                    <LessonPreviewRow labels={previewLabels} />
                  ) : null}
                  {lesson?.description ? (
                    <p className="text-body-sm text-muted-foreground">{lesson.description}</p>
                  ) : null}
                </GlassPanel>
              )}

              {locked ? (
                <>
                  <GlassPanel className="p-4 text-center">
                    <div className="mb-2 flex justify-center">
                      <UiIconImage name="lock" size={24} className="opacity-80" />
                    </div>
                    <p className="text-body-sm text-muted-foreground">
                      This lesson is locked. Complete the lessons below to continue your climb.
                    </p>
                  </GlassPanel>
                  <UnlockChecklist items={unlockRequirements} />
                </>
              ) : (
                <GlassPanel className="flex flex-wrap items-center justify-center gap-4 p-3 text-body-sm">
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
                </GlassPanel>
              )}

              {locked ? (
                <PrimaryClimbButton variant="outline" className="w-full" disabled>
                  Locked — keep climbing
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
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-white/15 text-body-sm font-medium text-muted-foreground transition-colors hover:border-trail-glow/40 hover:text-foreground"
                  >
                    <UiIconImage name="zap" size={16} />
                    Practice instead
                  </Link>
                </div>
              )}

              {nextLessonLabel && !locked ? (
                <GlassPanel className="flex items-center justify-between gap-2 p-3 text-left">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Next up
                    </p>
                    <p className="text-body-sm font-medium">{nextLessonLabel}</p>
                  </div>
                  <UiIconImage name="chevron_down" size={14} className="rotate-[-90deg] opacity-60" />
                </GlassPanel>
              ) : null}
            </div>
          </IllustratedScreen>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}
