"use client";

import Link from "next/link";
import { useMemo } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { Button } from "@/components/ui/button";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import {
  AUTH_MESSAGES,
  AUTH_ROUTES,
} from "@/features/authentication/constants/auth.constants";
import { useLogout } from "@/features/authentication/hooks/use-logout";
import { OfflineSyncPanel } from "@/features/offline/components/offline-sync-panel";
import { PwaInstallPrompt } from "@/features/offline/components/pwa-install-prompt";
import { BETA_RELEASE } from "@/lib/release/beta.constants";
import { OFFICIAL_RELEASE, RELEASE } from "@/lib/release/release.constants";
import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { useThemeSetting } from "@/features/settings/hooks/use-theme-setting";
import { useTrailPreferences } from "@/features/settings/hooks/use-trail-preferences";
import type { SettingsViewModel } from "@/features/settings/types/settings.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { cn } from "@/lib/utils";

type SettingsScreenProps = {
  settings: SettingsViewModel;
};

function TrailPreferenceRow({
  label,
  value,
  onClick,
  href,
}: {
  label: string;
  value: string;
  onClick?: () => void;
  href?: string;
}) {
  const className = cn(
    "flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-left transition-colors",
    (onClick || href) && "hover:border-trail-glow/35 hover:bg-black/50",
  );

  const body = (
    <>
      <span className="text-body-sm font-medium">{label}</span>
      <span className="text-caption text-muted-foreground">{value}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(className, "focus-ring")}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn(className, "focus-ring")}>
      {body}
    </button>
  );
}

export function SettingsScreen({ settings }: SettingsScreenProps) {
  const { theme, updateTheme, loading, error } = useThemeSetting(settings.theme);
  const preferences = useTrailPreferences(settings);
  const { logout, loading: logoutLoading, error: logoutError } = useLogout();
  const yama = useMemo(() => yamaService.resolveProfilePresence(), []);

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="profile_lantern_path"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 space-y-3 p-4 pt-3">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Profile
          </Link>

          <GlassPanel variant="header" className="space-y-1 rounded-card p-3">
            <StoryTitle as="h1" className="text-base">
              Trail preferences
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Lantern path — audio, language, and privacy for your climb
            </p>
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-2 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md space-y-4">
            <GlassPanel className="p-4">
              <YamaPresence
                presence={yama}
                size="sm"
                layout="horizontal"
                showMessage={false}
                bubbleClassName="border-glass-border bg-glass-bg/80"
              />
            </GlassPanel>

            <GlassPanel className="space-y-3 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                Audio
              </StoryTitle>
              <p className="text-caption text-muted-foreground">
                Mountain wind, lesson sounds, and shrine chimes along the trail.
              </p>
              <TrailPreferenceRow
                label="Trail sounds"
                value={preferences.soundEnabled ? "On" : "Muted"}
                onClick={() => void preferences.toggleSound()}
              />
              {preferences.error ? (
                <p className="text-caption text-destructive" role="alert">
                  {preferences.error}
                </p>
              ) : null}
            </GlassPanel>

            <GlassPanel className="space-y-3 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                Language
              </StoryTitle>
              <TrailPreferenceRow
                label="Study language"
                value={preferences.preferredLanguage === "ja" ? "Japanese" : "English"}
                onClick={() =>
                  void preferences.setLanguage(
                    preferences.preferredLanguage === "ja" ? "en" : "ja",
                  )
                }
              />
              <TrailPreferenceRow label="Romaji hints" value="When needed" />
            </GlassPanel>

            <GlassPanel className="space-y-3 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                Accessibility
              </StoryTitle>
              <TrailPreferenceRow label="Reduced motion" value="Follow device" />
              <TrailPreferenceRow label="Text size" value="Comfortable" />
              <TrailPreferenceRow label="High contrast trail" value="Off" />
            </GlassPanel>

            <GlassPanel className="space-y-3 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                Privacy
              </StoryTitle>
              <TrailPreferenceRow label="Learning analytics" value="Helps the trail" />
              <TrailPreferenceRow label="Leaderboard visibility" value="Friends only" />
              <TrailPreferenceRow label="Data export" value="Request scroll" href="/feedback" />
            </GlassPanel>

            <PwaInstallPrompt />
            <OfflineSyncPanel />

            <GlassPanel className="space-y-3 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                Support
              </StoryTitle>
              <TrailPreferenceRow
                label="Send feedback"
                value="Report trail issues"
                href="/feedback"
              />
              {BETA_RELEASE.enabled ? (
                <p className="text-caption text-muted-foreground">
                  Public beta {BETA_RELEASE.version}
                </p>
              ) : null}
            </GlassPanel>

            <GlassPanel className="space-y-2 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                About Noboru
              </StoryTitle>
              <TrailPreferenceRow
                label={RELEASE.name}
                value={
                  BETA_RELEASE.enabled
                    ? `Beta ${BETA_RELEASE.version}`
                    : `${OFFICIAL_RELEASE.label} v${RELEASE.version}`
                }
              />
              <TrailPreferenceRow label="Launch date" value={RELEASE.launchedAt} />
            </GlassPanel>

            <GlassPanel className="space-y-3 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                Appearance
              </StoryTitle>
              <ThemeSelector value={theme} onChange={updateTheme} disabled={loading} />
              {error ? (
                <p className="text-caption text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </GlassPanel>

            <GlassPanel className="space-y-2 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                Daily climb
              </StoryTitle>
              <TrailPreferenceRow
                label="Daily goal"
                value={`${settings.dailyGoalMinutes} min`}
              />
              <TrailPreferenceRow
                label="Quest reminders"
                value={preferences.notificationsEnabled ? "Lantern lit" : "Silent"}
                onClick={() => void preferences.toggleNotifications()}
              />
            </GlassPanel>

            <GlassPanel className="space-y-3 p-4">
              <StoryTitle as="h3" className="text-sm tracking-wide">
                Account
              </StoryTitle>
              <TrailPreferenceRow label="Traveler email" value={settings.email} />
              <TrailPreferenceRow
                label="Change password"
                value="Via email link"
                onClick={() => {
                  window.location.href = AUTH_ROUTES.forgotPassword;
                }}
              />
              {logoutError ? (
                <p className="text-caption text-destructive" role="alert">
                  {logoutError}
                </p>
              ) : null}
              <Button
                variant="destructive"
                className="w-full"
                loading={logoutLoading}
                onClick={() => void logout()}
              >
                {logoutLoading ? AUTH_MESSAGES.signOutLoading : AUTH_MESSAGES.signOut}
              </Button>
            </GlassPanel>
          </div>
        </main>
      </div>
    </IllustratedScreen>
  );
}
