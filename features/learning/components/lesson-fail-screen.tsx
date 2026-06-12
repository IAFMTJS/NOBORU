"use client";

import Link from "next/link";

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
        <Badge variant="outline">Trail node not cleared yet</Badge>
        <p className="text-body-sm text-muted-foreground">
          Review the material and try again. Production drills and the final recall
          round count toward your pass score.
        </p>
        <Button className="w-full" onClick={onRetry}>
          Retry lesson
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/learn/${regionSlug}`}>Back to region</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
