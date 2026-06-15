import Link from "next/link";

import { ContentHubBanner } from "@/components/ui/content-hub-banner";
import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { ContentHubScreen } from "@/components/visual/content-hub-screen";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { HiraganaChartViewModel } from "@/features/hiragana/types/hiragana.types";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";
import { CONTENT_HUB_TOKENS } from "@/lib/design-system/content-hub-tokens";
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
  const tokens = CONTENT_HUB_TOKENS.hiragana;
  const sections = SECTION_ORDER.map((label) => ({
    label,
    entries: chart.entries.filter((entry) => entry.rowLabel === label),
  })).filter((section) => section.entries.length > 0);

  return (
    <ContentHubScreen>
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

      <GlassPanel className={cn("space-y-4 p-4", tokens.progressCardBorder)}>
        <div className="space-y-1">
          <h2 className="text-heading-6 font-semibold">Your Progress</h2>
          <p className="text-body-sm text-muted-foreground">
            {chart.learnedCount} of {chart.totalCount} hiragana learned
          </p>
        </div>
        <ProgressBar
          value={chart.progressPercent}
          label="Hiragana mastery"
          showValue
          indicatorClassName={tokens.progressIndicator}
        />
      </GlassPanel>

      <div className="space-y-6">
        {sections.map((section) => (
          <GlassPanel key={section.label} className="space-y-3 p-4">
            <StoryTitle as="h2" className="text-sm">
              {section.label}
            </StoryTitle>
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
          </GlassPanel>
        ))}
      </div>
    </PageContainer>
    </ContentHubScreen>
  );
}
