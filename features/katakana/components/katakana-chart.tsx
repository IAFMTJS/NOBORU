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
import type { KatakanaChartViewModel } from "@/features/katakana/types/katakana.types";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";
import { cn } from "@/lib/utils";

type KatakanaChartProps = {
  chart: KatakanaChartViewModel;
};

const SECTION_ORDER = [
  "A row (ア行)",
  "Ka row (カ行)",
  "Sa row (サ行)",
  "Ta row (タ行)",
  "Na row (ナ行)",
  "Ha row (ハ行)",
  "Ma row (マ行)",
  "Ya row (ヤ行)",
  "Ra row (ラ行)",
  "Wa row (ワ行)",
  "N (ン)",
  "Voiced (濁音)",
  "Semi-voiced (半濁音)",
  "Combinations (拗音)",
];

export function KatakanaChart({ chart }: KatakanaChartProps) {
  const sections = SECTION_ORDER.map((label) => ({
    label,
    entries: chart.entries.filter((entry) => entry.rowLabel === label),
  })).filter((section) => section.entries.length > 0);

  return (
    <PageContainer>
      <ScreenHeader
        variant="story"
        title="Katakana Chart"
        subtitle="Track every character on your Forest Trail climb."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/forest-trail">Back</Link>
          </Button>
        }
      />

      <ContentHubBanner
        variant="katakana"
        title="Katakana Chart"
        subtitle={`${chart.learnedCount} of ${chart.totalCount} katakana learned`}
      />

      <YamaTrainingPresence location="kana_dojo" />

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {chart.learnedCount} of {chart.totalCount} katakana learned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={chart.progressPercent}
            label="Katakana mastery"
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
