import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GamesScreen() {
  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Games</h1>
        <p className="text-sm text-muted-foreground">Educational mini-games.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Games module will be built in a later phase.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
