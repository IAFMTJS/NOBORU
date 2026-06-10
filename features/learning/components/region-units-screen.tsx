import Link from "next/link";

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
import { TrailMap } from "@/features/learning/components/trail/trail-map";
import { buildTrailNodes } from "@/features/learning/utils/trail-state";
import { RegionTrialsPanel } from "@/features/trials/components/region-trials-panel";
import type { TrialListEntryViewModel } from "@/features/trials/types/trial.types";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";
import { getJlptQueryString } from "@/lib/learning/jlpt-content.constants";

type RegionUnitsScreenProps = {
  region: RegionPathViewModel;
  trials?: TrialListEntryViewModel[];
};

function RegionContentLinks({ jlptLevel }: { jlptLevel: "n5" | "n4" }) {
  const query = getJlptQueryString(jlptLevel);
  const levelLabel = jlptLevel.toUpperCase();

  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/vocabulary${query}`}>Open {levelLabel} Vocabulary</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/grammar${query}`}>Open {levelLabel} Grammar</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/kanji${query}`}>Open {levelLabel} Kanji Academy</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/reading${query}`}>Open {levelLabel} Reading</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/learn/listening${query}`}>Open {levelLabel} Listening</Link>
      </Button>
    </div>
  );
}

export function RegionUnitsScreen({ region, trials = [] }: RegionUnitsScreenProps) {
  const regionLocked = region.availability === "locked";
  return (
    <PageContainer>
      <ScreenHeader
        title={region.name}
        subtitle={region.description ?? "Region trail"}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn">Back</Link>
          </Button>
        }
      />

      {regionLocked ? (
        <Card className="border-dashed shadow-elevation-1">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Region Locked</CardTitle>
              <Badge variant="outline">Locked</Badge>
            </div>
            <CardDescription>
              {region.lockReason ?? "Complete the required trial to unlock this region."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/trials">Go to Trials</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Region Progress</CardTitle>
          <CardDescription>
            {region.completedCount} of {region.lessonCount} lessons complete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProgressBar
            value={region.progressPercent}
            label="Completion"
            showValue
          />
          {region.slug === "foothills" && !regionLocked ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn/hiragana">Open Hiragana Chart</Link>
            </Button>
          ) : null}
          {region.slug === "forest-trail" && !regionLocked ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn/katakana">Open Katakana Chart</Link>
            </Button>
          ) : null}
          {!regionLocked && region.slug === "mount-n5" ? (
            <RegionContentLinks jlptLevel="n5" />
          ) : null}
          {!regionLocked && region.slug === "mount-n4" ? (
            <RegionContentLinks jlptLevel="n4" />
          ) : null}
        </CardContent>
      </Card>

      {!regionLocked ? <RegionTrialsPanel regionSlug={region.slug} trials={trials} /> : null}

      {!regionLocked ? (
      <div className="space-y-4">
        {region.units.map((unit) => (
          <Card key={unit.id} className="shadow-elevation-1">
            <CardHeader>
              <CardTitle className="text-heading-6">{unit.name}</CardTitle>
              <CardDescription>{unit.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <TrailMap
                nodes={buildTrailNodes(unit.lessons)}
                title={unit.name}
                description={`${unit.completedCount}/${unit.lessonCount} lessons complete`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      ) : null}
    </PageContainer>
  );
}
