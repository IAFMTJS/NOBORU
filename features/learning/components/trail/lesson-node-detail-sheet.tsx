"use client";

import Link from "next/link";
import { Check, Clock, Gem, Lock, Mountain, Play, Zap } from "lucide-react";

import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { LessonSummaryViewModel } from "@/features/learning/types/lesson.types";
import type { TrailNodeViewModel } from "@/features/learning/utils/trail-state";
import { cn } from "@/lib/utils";

type LessonNodeDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: TrailNodeViewModel | null;
  lesson: LessonSummaryViewModel | null;
  lessonNumber: number | null;
  lessonCount: number;
  regionName: string;
};

function getStatusLabel(node: TrailNodeViewModel | null): string {
  if (!node) return "Lesson";
  switch (node.state) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "available":
      return "Ready";
    default:
      return "Locked";
  }
}

function NodeMarker({ node }: { node: TrailNodeViewModel }) {
  const locked = node.state === "locked";
  const completed = node.state === "completed";
  const Icon = locked ? Lock : completed ? Check : node.state === "in_progress" ? Play : Mountain;

  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2",
        completed && "border-success bg-success/20 text-success",
        node.state === "in_progress" && "border-primary bg-primary/20 text-primary",
        node.state === "available" && "border-primary/70 bg-primary/10 text-primary",
        locked && "border-border bg-muted text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </div>
  );
}

export function LessonNodeDetailSheet({
  open,
  onOpenChange,
  node,
  lesson,
  lessonNumber,
  lessonCount,
  regionName,
}: LessonNodeDetailSheetProps) {
  if (!node) return null;

  const locked = node.state === "locked" || !node.href;
  const lessonLabel =
    lessonNumber && lessonCount > 0
      ? `Lesson ${lessonNumber} of ${lessonCount}`
      : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left">
          <div className="flex items-start gap-3">
            <NodeMarker node={node} />
            <div className="min-w-0 space-y-1">
              <SheetTitle>{node.label}</SheetTitle>
              <p className="text-caption text-muted-foreground">
                {regionName}
                {lessonLabel ? ` · ${lessonLabel}` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant={locked ? "outline" : node.state === "in_progress" ? "default" : "secondary"}
                >
                  {getStatusLabel(node)}
                </Badge>
                {node.nodeKind === "checkpoint" ? (
                  <Badge variant="outline" className="border-warning/50 text-warning">
                    Exam
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {(lesson?.description || node.subtitle) ? (
            <div className="rounded-xl border border-border/60 bg-card/90 p-4">
              <p className="mb-2 text-caption font-medium uppercase tracking-wide text-muted-foreground">
                Learn
              </p>
              <p className="text-body-sm">
                {lesson?.description ?? node.subtitle}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 text-body-sm">
            <span className="text-muted-foreground">
              XP{" "}
              <span className="font-medium text-foreground">{node.xpReward}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Gem className="h-3.5 w-3.5" aria-hidden />
              <span className="font-medium text-foreground">—</span>
            </span>
            {lesson?.estimatedDuration ? (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                <span className="font-medium text-foreground">
                  {lesson.estimatedDuration} min
                </span>
              </span>
            ) : null}
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          {locked ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/trials">Unlock on the trail</Link>
            </Button>
          ) : (
            <>
              <Button className="w-full" size="lg" asChild>
                <AnalyticsLink
                  href={node.href!}
                  eventName="trail_continue_clicked"
                  eventProperties={{
                    source: "learn_node_detail",
                    lessonTitle: node.label,
                  }}
                >
                  {node.state === "completed" ? "Review Lesson" : "Continue Lesson"}
                </AnalyticsLink>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/review">
                  <Zap className="mr-2 h-4 w-4" aria-hidden />
                  Practice
                </Link>
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
