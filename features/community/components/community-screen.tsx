import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CommunityScreen() {
  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Community</h1>
        <p className="text-sm text-muted-foreground">Social features and challenges.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Community features are post-MVP.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
