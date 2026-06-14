import Link from "next/link";
import { SceneImage } from "@/components/media/scene-image";
import { PageContainer } from "@/components/layout/page-container";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TrialPerformancePanel } from "@/features/trials/components/trial-performance-panel";
import {
  TRIAL_GRADE_LABELS,
  TRIAL_KIND_LABELS,
} from "@/features/trials/constants/trial.constants";
import type {
  TrialListEntryViewModel,
  TrialPerformanceViewModel,
} from "@/features/trials/types/trial.types";

type TrialHubProps = {
  trials: TrialListEntryViewModel[];
  performance: TrialPerformanceViewModel;
};

function TrialCard({ trial }: { trial: TrialListEntryViewModel }) {
  const locked = trial.availability === "locked";
  const passed = trial.availability === "passed";

  return (
    <GlassPanel className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <StoryTitle as="h3" className="text-sm">
            {trial.title}
          </StoryTitle>
          <p className="text-body-sm text-muted-foreground">{trial.description}</p>
        </div>
        {locked ? (
          <UiIconImage name="lock" size={20} className="opacity-70" />
        ) : passed ? (
          <UiIconImage name="trophy" size={20} />
        ) : (
          <UiIconImage name="mountain" size={20} />
        )}
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{TRIAL_KIND_LABELS[trial.kind]}</Badge>
          <Badge variant="secondary">{trial.bossName}</Badge>
          <Badge variant="outline">Pass {trial.passScore}%</Badge>
          {trial.progress?.bestGrade ? (
            <Badge variant="outline">
              Best: {TRIAL_GRADE_LABELS[trial.progress.bestGrade]}
            </Badge>
          ) : null}
        </div>
        {trial.progress ? (
          <ProgressBar
            value={trial.progress.bestScore}
            label="Best score"
            showValue
          />
        ) : null}
        {locked ? (
          <p className="text-caption text-muted-foreground">{trial.lockReason}</p>
        ) : null}
        <Button className="w-full" disabled={locked} asChild={!locked}>
          {locked ? (
            <span>Locked</span>
          ) : (
            <Link href={`/trials/${trial.slug}`}>
              {passed ? "Retry Trial" : "Start Trial"}
            </Link>
          )}
        </Button>
      </div>
    </GlassPanel>
  );
}

export function TrialHub({ trials, performance }: TrialHubProps) {
  const regional = trials.filter((trial) => trial.kind === "regional_challenge");
  const bossAndFinal = trials.filter(
    (trial) => trial.kind === "boss_trial" || trial.kind === "final_trial",
  );

  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <SceneImage
          scene="study_atmosphere"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
    <PageContainer>
      <ScreenHeader
        variant="story"
        title="Trials"
        subtitle="High-stakes challenges that validate real recall"
      />

      <TrialPerformancePanel performance={performance} />

      <div className="space-y-3">
        <h2 className="text-heading-6">Regional Challenges</h2>
        {regional.map((trial) => (
          <TrialCard key={trial.id} trial={trial} />
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-heading-6">Boss & Final Trials</h2>
        {bossAndFinal.map((trial) => (
          <TrialCard key={trial.id} trial={trial} />
        ))}
      </div>
    </PageContainer>
    </IllustratedScreen>
  );
}
