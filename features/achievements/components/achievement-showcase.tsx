import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { AchievementBadge } from "@/features/achievements/components/achievement-badge";
import { ACHIEVEMENT_RARITY_LABELS } from "@/features/achievements/constants/achievement.constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";

type AchievementShowcaseProps = {
  showcase: AchievementShowcaseViewModel;
  compact?: boolean;
};

export function AchievementShowcase({
  showcase,
  compact = false,
}: AchievementShowcaseProps) {
  if (compact) {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-heading-6">Achievements</CardTitle>
          <CardDescription>
            {showcase.totalUnlocked}/{showcase.totalAvailable} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {showcase.unlocked.slice(0, 6).map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                name={achievement.name}
                rarity={achievement.rarity}
              />
            ))}
            {showcase.unlocked.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">
                Complete lessons and reviews to earn your first badge.
              </p>
            ) : null}
          </div>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/achievements">View All Achievements</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Unlocked</CardTitle>
          <CardDescription>
            {showcase.totalUnlocked} of {showcase.totalAvailable} achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {showcase.unlocked.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">
              No achievements unlocked yet. Keep climbing.
            </p>
          ) : (
            showcase.unlocked.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-body-sm font-medium">{achievement.name}</p>
                    <Badge variant="outline">
                      {ACHIEVEMENT_RARITY_LABELS[achievement.rarity]}
                    </Badge>
                  </div>
                  {achievement.description ? (
                    <p className="text-caption text-muted-foreground">
                      {achievement.description}
                    </p>
                  ) : null}
                </div>
                {achievement.unlockedAt ? (
                  <p className="text-caption text-muted-foreground">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {showcase.locked.length > 0 ? (
        <Card className="shadow-elevation-1">
          <CardHeader>
            <CardTitle>Still to Earn</CardTitle>
            <CardDescription>Goals waiting on the trail ahead</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {showcase.locked.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-dashed p-3 opacity-80"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-body-sm font-medium">{achievement.name}</p>
                    <Badge variant="outline">
                      {ACHIEVEMENT_RARITY_LABELS[achievement.rarity]}
                    </Badge>
                  </div>
                  {achievement.description ? (
                    <p className="text-caption text-muted-foreground">
                      {achievement.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
