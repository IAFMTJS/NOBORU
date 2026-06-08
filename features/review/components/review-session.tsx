import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewCardViewModel } from "@/features/review/types/review.types";

type ReviewSessionProps = {
  card: ReviewCardViewModel;
};

export function ReviewSession({ card }: ReviewSessionProps) {
  return (
    <div className="space-y-4 p-4">
      <header>
        <h1 className="text-2xl font-semibold">Review</h1>
        <p className="text-sm text-muted-foreground">Spaced repetition training.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-4xl">{card.term}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">{card.reading}</p>
          <p className="text-lg text-muted-foreground">{card.meaning}</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="border-error text-error">
              Again
            </Button>
            <Button variant="outline" className="border-warning text-warning">
              Good
            </Button>
            <Button variant="outline" className="border-success text-success">
              Easy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
