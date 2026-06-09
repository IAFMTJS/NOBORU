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
import { ListRow } from "@/components/ui/list-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { KanjiListViewModel } from "@/features/kanji/types/kanji.types";

type KanjiListProps = {
  list: KanjiListViewModel;
};

export function KanjiList({ list }: KanjiListProps) {
  return (
    <PageContainer>
      <ScreenHeader
        title="N5 Kanji Academy"
        subtitle="Track every kanji on your Mount N5 climb."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/mount-n5">Back</Link>
          </Button>
        }
      />

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {list.learnedCount} of {list.totalCount} N5 kanji learned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={list.progressPercent}
            label="Kanji mastery"
            showValue
          />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Kanji Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {list.entries.map((entry) => (
            <Link key={entry.id} href={`/learn/kanji/${entry.id}`}>
              <ListRow
                primary={entry.character}
                secondary={entry.meaning}
                trailing={
                  entry.learned ? (
                    <Badge variant="secondary">Learned</Badge>
                  ) : (
                    <Badge variant="outline">New</Badge>
                  )
                }
              />
            </Link>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
