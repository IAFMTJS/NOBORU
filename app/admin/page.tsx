import Link from "next/link";

import { AnalyticsSummaryPanel } from "@/features/admin/components/analytics-summary-panel";
import { LaunchReadinessPanel } from "@/features/admin/components/launch-readiness-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OFFICIAL_RELEASE, RELEASE } from "@/lib/release/release.constants";

const CONTENT_LINKS = [
  { href: "/admin/content/vocabulary", label: "Vocabulary", description: "Words and readings" },
  { href: "/admin/content/kanji", label: "Kanji", description: "Characters and on/kun readings" },
  { href: "/admin/content/grammar", label: "Grammar", description: "Grammar points" },
  { href: "/admin/content/lessons", label: "Lessons", description: "Unit lessons" },
  { href: "/admin/content/regions", label: "Regions", description: "Trail regions" },
  { href: "/admin/content/feedback", label: "Feedback", description: "Public beta submissions" },
  { href: "/admin/content/achievements", label: "Achievements", description: "Badges and rewards" },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-3">Operations Dashboard</h1>
        <p className="text-body-sm text-muted-foreground">
          {OFFICIAL_RELEASE.label} v{RELEASE.version} — monitor launch readiness, analytics, and content.
        </p>
      </div>

      <LaunchReadinessPanel />
      <AnalyticsSummaryPanel />

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">Content CMS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CONTENT_LINKS.map(({ href, label, description }) => (
              <Link key={href} href={href}>
                <Card className="h-full transition-colors hover:border-primary/40">
                  <CardHeader>
                    <CardTitle className="text-heading-6">{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
