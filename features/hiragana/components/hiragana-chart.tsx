import Link from "next/link";

import { ContentHubBanner } from "@/components/ui/content-hub-banner";
import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { HiraganaChartViewModel } from "@/features/hiragana/types/hiragana.types";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";
import { cn } from "@/lib/utils";

type HiraganaChartProps = {
  chart: HiraganaChartViewModel;
};

const SECTION_ORDER = [
  "A row (あ行)",
  "Ka row (か行)",
  "Sa row (さ行)",
  "Ta row (た行)",
  "Na row (な行)",
  "Ha row (は行)",
  "Ma row (ま行)",
  "Ya row (や行)",
  "Ra row (ら行)",
  "Wa row (わ行)",
  "N (ん)",
  "Voiced (濁音)",
  "Semi-voiced (半濁音)",
  "Combinations (拗音)",
];

export function HiraganaChart({ chart }: HiraganaChartProps) {
  const sections = SECTION_ORDER.map((label) => ({
    label,
    entries: chart.entries.filter((entry) => entry.rowLabel === label),
  })).filter((section) => section.entries.length > 0);

  return (
    <PageContainer>
      <ScreenHeader
        variant="story"
        title="Hiragana Chart"
        subtitle="Track every character on your Foothills climb."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/foothills">Back</Link>
          </Button>
        }
      />

      <ContentHubBanner
        variant="hiragana"
        title="Hiragana Chart"
        subtitle={`${chart.learnedCount} of ${chart.totalCount} hiragana learned`}
      />

      <YamaTrainingPresence location="kana_dojo" />

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {chart.learnedCount} of {chart.totalCount} hiragana learned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={chart.progressPercent}
            label="Hiragana mastery"
            showValue
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.label} className="shadow-elevation-1">
            <CardHeader>
              <CardTitle className="text-heading-6">{section.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {section.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "rounded-xl border border-border px-3 py-4 text-center",
                      entry.learned
                        ? "border-success/40 bg-success/5"
                        : "bg-card",
                    )}
                  >
                    <p className="text-heading-4">{entry.character}</p>
                    <p className="text-caption text-muted-foreground">
                      {entry.romaji}
                    </p>
                    {entry.learned ? (
                      <Badge variant="secondary" className="mt-2">
                        Learned
                      </Badge>
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
