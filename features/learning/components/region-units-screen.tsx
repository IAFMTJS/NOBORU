import Link from "next/link";

import { RegionHeroImage } from "@/components/media/region-hero-image";
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
import { RegionContentLinks } from "@/features/learning/components/region-content-links";
import { RegionContinueFooter } from "@/features/learning/components/region-continue-footer";
import { TrailMap } from "@/features/learning/components/trail/trail-map";
import { buildTrailNodes, getUnitTrailPlacementRange } from "@/features/learning/services/trail.service";
import { getNextLessonInRegion } from "@/features/learning/utils/region-lesson";
import { RegionTrialsPanel } from "@/features/trials/components/region-trials-panel";
import type { TrialListEntryViewModel } from "@/features/trials/types/trial.types";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { cn } from "@/lib/utils";

type RegionUnitsScreenProps = {
  region: RegionPathViewModel;
  trials?: TrialListEntryViewModel[];
};

export function RegionUnitsScreen({ region, trials = [] }: RegionUnitsScreenProps) {
  const regionLocked = region.availability === "locked";
  const visuals = getRegionVisuals(region.slug);
  const nextLesson = getNextLessonInRegion(region);
  const jlptLevel =
    region.slug === "mount-n4" ? ("n4" as const) : region.slug === "mount-n5" ? ("n5" as const) : null;

  return (
    <PageContainer className="pb-24">
      <ScreenHeader
        title={region.name}
        subtitle={region.description ?? "Region trail"}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn">Back</Link>
          </Button>
        }
      />

      <div
        className={cn(
          "mb-4 overflow-hidden rounded-2xl border bg-gradient-to-br to-card shadow-elevation-1",
          visuals.gradient,
          visuals.border,
        )}
      >
        <RegionHeroImage
          regionSlug={region.slug}
          alt={`${region.name} region`}
        />
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <p className="text-body-sm font-medium">{region.name}</p>
          <Badge className={visuals.badge}>{visuals.label}</Badge>
        </div>
      </div>

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

      {!regionLocked ? (
        <RegionTrialsPanel regionSlug={region.slug} trials={trials} variant="peak" />
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
            <>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/learn/intake">What I already know</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/learn/hiragana">Open Hiragana Chart</Link>
              </Button>
            </>
          ) : null}
          {region.slug === "forest-trail" && !regionLocked ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn/katakana">Open Katakana Chart</Link>
            </Button>
          ) : null}
          {!regionLocked && jlptLevel ? (
            <RegionContentLinks jlptLevel={jlptLevel} variant="chips" />
          ) : null}
        </CardContent>
      </Card>

      {!regionLocked ? (
        <div className="space-y-4">
          {region.units.map((unit, unitIndex) => (
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
                  regionSlug={region.slug}
                  placementRange={getUnitTrailPlacementRange(region.units, unitIndex)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!regionLocked && nextLesson ? (
        <RegionContinueFooter
          lessonTitle={nextLesson.title}
          href={nextLesson.href}
        />
      ) : null}
    </PageContainer>
  );
}
