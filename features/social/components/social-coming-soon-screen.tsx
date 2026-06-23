import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";

type SocialComingSoonScreenProps = {
  title: string;
  description: string;
};

export function SocialComingSoonScreen({ title, description }: SocialComingSoonScreenProps) {
  return (
    <SecondaryScreenShell title="Community" subtitle="Coming soon" backHref="/camp" backLabel="Camp">
      <YamaEmptyState
        surface="generic"
        title={title}
        description={description}
        actionHref="/camp"
        actionLabel="Return to Camp"
      />
      <Button asChild variant="secondary" className="mt-4 rounded-xl">
        <Link href="/study">Practice at Study</Link>
      </Button>
    </SecondaryScreenShell>
  );
}
