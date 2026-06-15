import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { IllustratedScreen, PrimaryClimbButton, StoryTitle } from "@/components/visual";
import { WorldToriiGate } from "@/components/visual/world/world-torii-gate";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { profileServerService } from "@/features/profile/services/profile-server.service";
import { redirect } from "next/navigation";

export default async function EndgamePage() {
  const profile = await profileServerService.getProfileCore();
  if (!profile) redirect(AUTH_ROUTES.login);

  return (
    <IllustratedScreen
      scrim="full"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="world_map_peaks"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 p-6 text-center">
        <WorldToriiGate width={120} height={80} className="mx-auto h-20 w-30" />
        <StoryTitle as="h1">Mastery Mountains</StoryTitle>
        <p className="text-body-sm text-muted-foreground">
          Post-N1 endgame — infinite challenges and seasonal climbs. Educational progress
          stays authoritative; endgame rewards are cosmetic and prestige only.
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
      </div>
    </IllustratedScreen>
  );
}
