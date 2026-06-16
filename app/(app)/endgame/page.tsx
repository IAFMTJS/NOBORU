import Link from "next/link";
import { redirect } from "next/navigation";

import { GlassPanel, PrimaryClimbButton } from "@/components/visual";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { WorldToriiGate } from "@/components/visual/world/world-torii-gate";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { profileServerService } from "@/features/profile/services/profile-server.service";

export default async function EndgamePage() {
  const profile = await profileServerService.getProfileCore();
  if (!profile) redirect(AUTH_ROUTES.login);

  return (
    <SecondaryScreenShell
      title="Mastery Mountains"
      subtitle="Post-N1 endgame — infinite challenges and seasonal climbs"
      backHref="/learn"
      backLabel="Journey"
      contentClassName="flex flex-col justify-center pb-2"
    >
      <GlassPanel className="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center">
        <WorldToriiGate width={120} height={80} className="mx-auto h-20 w-30" />
        <p className="text-body-sm text-muted-foreground">
          Educational progress stays authoritative; endgame rewards are cosmetic and prestige
          only.
        </p>
        <PrimaryClimbButton asChild className="w-full">
          <Link href="/learn/world">View world map</Link>
        </PrimaryClimbButton>
        <Link
          href="/world/events"
          className="text-body-sm text-trail-glow underline-offset-4 hover:underline"
        >
          Seasonal events
        </Link>
      </GlassPanel>
    </SecondaryScreenShell>
  );
}
