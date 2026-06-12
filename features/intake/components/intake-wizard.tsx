"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { MascotImage } from "@/components/media/mascot-image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OnboardingProgress } from "@/features/onboarding/components/onboarding-progress";
import { KanaSelectionGrid } from "@/features/intake/components/kana-selection-grid";
import { VocabularySelectionList } from "@/features/intake/components/vocabulary-selection-list";
import {
  INTAKE_COPY,
  INTAKE_STEP_COUNT,
} from "@/features/intake/constants/intake.constants";
import { intakeClientService } from "@/features/intake/services/intake-client.service";
import type { IntakeChartData } from "@/features/intake/types/intake.types";

type IntakeWizardProps = {
  chartData: IntakeChartData;
};

function buildInitialSelection(entries: Array<{ id: string; learned: boolean }>) {
  return new Set(entries.filter((entry) => entry.learned).map((entry) => entry.id));
}

export function IntakeWizard({ chartData }: IntakeWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [hiraganaIds, setHiraganaIds] = useState(() =>
    buildInitialSelection(chartData.hiragana),
  );
  const [katakanaIds, setKatakanaIds] = useState(() =>
    buildInitialSelection(chartData.katakana),
  );
  const [vocabularyIds, setVocabularyIds] = useState(() =>
    buildInitialSelection(chartData.vocabulary),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const summary = useMemo(
    () => ({
      hiraganaCount: hiraganaIds.size,
      katakanaCount: katakanaIds.size,
      vocabularyCount: vocabularyIds.size,
      totalKanaCount: hiraganaIds.size + katakanaIds.size,
    }),
    [hiraganaIds, katakanaIds, vocabularyIds],
  );

  function goBack() {
    setError(null);
    setStep((current) => Math.max(1, current - 1));
  }

  function goNext() {
    setError(null);
    setStep((current) => Math.min(INTAKE_STEP_COUNT, current + 1));
  }

  async function saveAndPractice(mode: "reinforce" | "grow") {
    setLoading(true);
    setError(null);

    const result = await intakeClientService.saveIntake({
      hiraganaIds: Array.from(hiraganaIds),
      katakanaIds: Array.from(katakanaIds),
      vocabularyIds: Array.from(vocabularyIds),
    });

    if (!result.success) {
      setLoading(false);
      setError(result.error ?? "Unable to save your inventory.");
      return;
    }

    router.push(`/learn/intake/practice?mode=${mode}`);
    router.refresh();
  }

  const canContinue =
    step === 1 ||
    step === 2 ||
    step === 3 ||
    step === 4 ||
    (step === 5 && summary.totalKanaCount + summary.vocabularyCount > 0);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <OnboardingProgress currentStep={step} totalSteps={INTAKE_STEP_COUNT} />
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 py-8">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center space-y-6">
          {step === 1 ? (
            <div className="space-y-6 text-center">
              <div className="relative mx-auto h-28 w-28">
                <MascotImage alt="Yama" fill className="object-contain" priority />
              </div>
              <h1 className="text-heading-3">{INTAKE_COPY.intro.title}</h1>
              <p className="text-body text-muted-foreground">{INTAKE_COPY.intro.subtitle}</p>
            </div>
          ) : null}

          {step === 2 ? (
            <KanaSelectionGrid
              title={INTAKE_COPY.hiragana.title}
              subtitle={INTAKE_COPY.hiragana.subtitle}
              entries={chartData.hiragana}
              selectedIds={hiraganaIds}
              onChange={setHiraganaIds}
            />
          ) : null}

          {step === 3 ? (
            <KanaSelectionGrid
              title={INTAKE_COPY.katakana.title}
              subtitle={INTAKE_COPY.katakana.subtitle}
              entries={chartData.katakana}
              selectedIds={katakanaIds}
              onChange={setKatakanaIds}
            />
          ) : null}

          {step === 4 ? (
            <VocabularySelectionList
              title={INTAKE_COPY.vocabulary.title}
              subtitle={INTAKE_COPY.vocabulary.subtitle}
              entries={chartData.vocabulary}
              selectedIds={vocabularyIds}
              onChange={setVocabularyIds}
            />
          ) : null}

          {step === 5 ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-heading-4">{INTAKE_COPY.summary.title}</h2>
                <p className="text-body-sm text-muted-foreground">
                  {INTAKE_COPY.summary.subtitle}
                </p>
              </div>
              <Card className="shadow-elevation-1">
                <CardHeader>
                  <CardTitle>Your inventory</CardTitle>
                  <CardDescription>Practice will scaffold from these items</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-heading-4">{summary.hiraganaCount}</p>
                    <p className="text-caption text-muted-foreground">Hiragana</p>
                  </div>
                  <div>
                    <p className="text-heading-4">{summary.katakanaCount}</p>
                    <p className="text-caption text-muted-foreground">Katakana</p>
                  </div>
                  <div>
                    <p className="text-heading-4">{summary.vocabularyCount}</p>
                    <p className="text-caption text-muted-foreground">Words</p>
                  </div>
                </CardContent>
              </Card>
              <p className="text-body-sm text-muted-foreground">
                <strong className="font-medium text-foreground">Practice what you know</strong>{" "}
                uses only kana and words you selected, with romaji and English hints.
                <br />
                <strong className="font-medium text-foreground">Learn more</strong> introduces a
                few new kana at a time while keeping most of the text in characters you already
                know.
              </p>
            </div>
          ) : null}

          {error ? <p className="text-body-sm text-destructive">{error}</p> : null}
        </div>

        <div className="mx-auto w-full max-w-md space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {step < INTAKE_STEP_COUNT ? (
            <div className="flex gap-3">
              {step > 1 ? (
                <Button variant="outline" className="flex-1" onClick={goBack}>
                  Back
                </Button>
              ) : (
                <Button variant="ghost" className="flex-1" asChild>
                  <Link href="/learn">Skip for now</Link>
                </Button>
              )}
              <Button className="flex-1" disabled={!canContinue} onClick={goNext}>
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                className="w-full"
                disabled={loading || !canContinue}
                onClick={() => saveAndPractice("grow")}
              >
                {loading ? "Saving…" : "Save & learn more"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={loading || !canContinue}
                onClick={() => saveAndPractice("reinforce")}
              >
                Save & practice what I know
              </Button>
              <Button variant="ghost" className="w-full" onClick={goBack}>
                Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
