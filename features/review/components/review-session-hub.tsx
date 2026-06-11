import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReviewStatsViewModel } from "@/features/review/types/review.types";

type ReviewSessionHubProps = {
  stats: ReviewStatsViewModel;
};

const PRESET_MODES = [
  { label: "Quick 5", href: "/review?limit=5" },
  { label: "Quick 10", href: "/review?limit=10" },
  { label: "Quick 20", href: "/review?limit=20" },
  { label: "All Due", href: "/review" },
] as const;

export function ReviewSessionHub({ stats }: ReviewSessionHubProps) {
  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardTitle className="text-heading-6">Start a session</CardTitle>
        <CardDescription>
          {stats.dueCount} item{stats.dueCount === 1 ? "" : "s"} due for review
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {PRESET_MODES.map((mode) => (
            <Button key={mode.label} variant="outline" asChild>
              <Link href={mode.href}>{mode.label}</Link>
            </Button>
          ))}
        </div>
        {stats.weakAreas.length > 0 ? (
          <div className="space-y-2">
            <p className="text-caption text-muted-foreground">Weak areas</p>
            <div className="flex flex-wrap gap-2">
              {stats.weakAreas.map((area) => (
                <Button key={area.contentType} variant="secondary" size="sm" asChild>
                  <Link
                    href={`/review?contentType=${area.contentType}&weakOnly=true&limit=10`}
                  >
                    {area.label} ({area.count})
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
