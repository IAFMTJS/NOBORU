import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LearnScreen() {
  return (
    <div className="space-y-4 p-4">
      <header>
        <h1 className="text-2xl font-semibold">Learn</h1>
        <p className="text-sm text-muted-foreground">
          Your path, lessons, vocabulary, grammar, and kanji.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Learning Path</CardTitle>
          <CardDescription>
            Path map and lesson content will load from the content system in Phase 2.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
