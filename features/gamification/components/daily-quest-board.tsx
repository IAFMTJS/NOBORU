import Link from "next/link";
import type { ReactNode } from "react";
import { Check } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { GlassPanel, RewardChip, StoryTitle } from "@/components/visual";
import type {
  DailyQuestsViewModel,
  WeeklyQuestsViewModel,
} from "@/features/quests/types/quest.types";
import { cn } from "@/lib/utils";

type DailyQuestBoardProps = {
  daily: DailyQuestsViewModel;
  weekly?: WeeklyQuestsViewModel;
  variant?: "camp" | "compact";
  streakDays?: number;
};

const STREAK_MILESTONES = [7, 14, 30, 50] as const;

function QuestBoardFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border-2 border-amber-900/50 p-3",
        "bg-gradient-to-b from-amber-950/70 via-amber-950/85 to-amber-950/95",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.06),inset_0_-2px_8px_rgb(0_0_0/0.35)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 3px, rgb(0 0 0 / 0.08) 3px, rgb(0 0 0 / 0.08) 4px)",
        }}
      />
      <div className="relative space-y-3">{children}</div>
    </div>
  );
}

function QuestRow({
  title,
  current,
  target,
  completed,
  epReward,
  href,
  compact,
}: {
  title: string;
  current: number;
  target: number;
  completed: boolean;
  epReward: number;
  href: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-amber-900/30 bg-black/25 px-2.5 py-2",
        completed && "opacity-70",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          completed
            ? "border-success/60 bg-success/20 text-success"
            : "border-amber-700/50 bg-amber-950/50",
        )}
        aria-hidden
      >
        {completed ? <Check className="h-3 w-3" /> : null}
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-body-sm font-medium text-amber-50/95",
              completed && "line-through text-amber-100/50",
            )}
          >
            {title}
          </p>
          <RewardChip variant="xp" className="shrink-0 text-xs">
            +{epReward} EP
          </RewardChip>
        </div>
        {!completed ? (
          <ProgressBar
            value={current}
            max={target}
            label={title}
            showValue
            className="h-1.5"
          />
        ) : (
          <p className="text-caption text-success/80">Complete</p>
        )}
        {!completed && !compact ? (
          <Link
            href={href}
            className="text-caption font-medium text-trail-glow hover:underline"
          >
            Continue on trail
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function StreakTimeline({ streakDays }: { streakDays: number }) {
  return (
    <GlassPanel className="space-y-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-sm font-medium">Daily streak</p>
        <span className="text-body-sm tabular-nums text-trail-glow">
          {streakDays} day{streakDays === 1 ? "" : "s"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1">
        {STREAK_MILESTONES.map((milestone) => {
          const reached = streakDays >= milestone;
          return (
            <div key={milestone} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={cn(
                  "text-lg",
                  reached ? "text-trail-glow" : "text-muted-foreground/40",
                )}
                aria-hidden
              >
                🔥
              </span>
              <span
                className={cn(
                  "text-caption tabular-nums",
                  reached ? "text-trail-glow" : "text-muted-foreground",
                )}
              >
                {milestone}
              </span>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

function QuestSection({
  title,
  subtitle,
  quests,
  compact,
}: {
  title: string;
  subtitle: string;
  quests: DailyQuestsViewModel["quests"];
  compact?: boolean;
}) {
  return (
    <>
      <div className="space-y-0.5 px-1">
        <StoryTitle as="h3" className="text-sm normal-case tracking-wide text-amber-100">
          {title}
        </StoryTitle>
        <p className="text-caption text-amber-200/60">{subtitle}</p>
      </div>
      <div className="space-y-2">
        {quests.map((quest) => (
          <QuestRow
            key={quest.id}
            title={quest.title}
            current={quest.current}
            target={quest.target}
            completed={quest.completed}
            epReward={quest.epReward}
            href={quest.href}
            compact={compact}
          />
        ))}
      </div>
    </>
  );
}

export function DailyQuestBoard({
  daily,
  weekly,
  variant = "camp",
  streakDays = 0,
}: DailyQuestBoardProps) {
  const compact = variant === "compact";

  return (
    <div className="space-y-3">
      <QuestBoardFrame>
        <QuestSection
          title="Today's Quests"
          subtitle={`${daily.completedCount}/${daily.totalCount} complete`}
          quests={daily.quests}
          compact={compact}
        />
        {weekly && weekly.totalCount > 0 ? (
          <QuestSection
            title="Weekly Quests"
            subtitle={`${weekly.completedCount}/${weekly.totalCount} this week`}
            quests={weekly.quests}
            compact={compact}
          />
        ) : null}
      </QuestBoardFrame>
      {!compact && streakDays > 0 ? <StreakTimeline streakDays={streakDays} /> : null}
    </div>
  );
}
