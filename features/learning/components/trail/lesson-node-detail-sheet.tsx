"use client";

import Link from "next/link";
import { Clock, Mountain, Zap } from "lucide-react";

import { AnalyticsLink } from "@/features/analytics/components/analytics-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { LessonSummaryViewModel } from "@/features/learning/types/lesson.types";
import type { TrailNodeViewModel } from "@/features/learning/utils/trail-state";

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
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-primary" aria-hidden />
            <SheetTitle>{node.label}</SheetTitle>
          </div>
          <SheetDescription>
            {regionName}
            {lessonLabel ? ` · ${lessonLabel}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-2">
          <Badge variant={locked ? "outline" : "default"}>{getStatusLabel(node)}</Badge>
          {lesson?.description ? (
            <p className="text-body-sm text-muted-foreground">{lesson.description}</p>
          ) : node.subtitle ? (
            <p className="text-body-sm text-muted-foreground">{node.subtitle}</p>
          ) : null}
          <div className="flex flex-wrap gap-3 text-body-sm">
            <span className="text-muted-foreground">
              XP <span className="font-medium text-foreground">{node.xpReward}</span>
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
