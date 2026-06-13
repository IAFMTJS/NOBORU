"use client";

import Link from "next/link";

import { regionTrailHref } from "@/features/learning/utils/trail-navigation";

import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LessonFailScreenProps = {
  score: number;
  passScore: number;
  regionSlug: string;
  onRetry: () => void;
};

export function LessonFailScreen({
  score,
  passScore,
  regionSlug,
  onRetry,
}: LessonFailScreenProps) {
  return (
    <Card className="border-destructive/30 shadow-elevation-1">
      <CardHeader>
        <CardTitle>Keep training</CardTitle>
        <CardDescription>
          Score {score}% · Need {passScore}% to unlock the next lesson
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <YamaPresence
          presence={yamaService.resolveFailPresence()}
          size="md"
          layout="vertical"
          className="items-center"
        />
        <Badge variant="outline">Trail node not cleared yet</Badge>
        <p className="text-body-sm text-muted-foreground">
          Review the material and try again. Production drills and the final recall
          round count toward your pass score.
        </p>
        <Button className="w-full" onClick={onRetry}>
          Retry lesson
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href={regionTrailHref(regionSlug)}>Back to trail</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
