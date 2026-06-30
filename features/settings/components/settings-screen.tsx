"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/visual";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import {
  AUTH_MESSAGES,
  AUTH_ROUTES,
} from "@/features/authentication/constants/auth.constants";
import { useLogout } from "@/features/authentication/hooks/use-logout";
import { SettingsOfflineSection } from "@/features/settings/components/settings-offline-section";
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
    "focus-ring flex w-full items-center justify-between gap-3 rounded-xl border border-white/55 bg-white/48 px-3 py-2.5 text-left shadow-elevation-1 backdrop-blur-md transition-colors",
    (onClick || href) && "hover:bg-white/58",
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
    <SecondaryScreenShell
      title="Trail preferences"
      subtitle="Lantern path — audio, language, and privacy for your climb"
      backHref="/profile"
      backLabel="Profile"
      contentClassName="pb-2"
    >
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
              <h3 className="font-sans text-body font-semibold tracking-wide">Audio</h3>
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
              <h3 className="font-sans text-body font-semibold tracking-wide">Language</h3>
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
              <h3 className="font-sans text-body font-semibold tracking-wide">Accessibility</h3>
              <TrailPreferenceRow label="Reduced motion" value="Follow device" />
              <TrailPreferenceRow label="Text size" value="Comfortable" />
              <TrailPreferenceRow label="High contrast trail" value="Off" />
            </GlassPanel>

            <GlassPanel className="space-y-3 p-4">
              <h3 className="font-sans text-body font-semibold tracking-wide">Privacy</h3>
              <TrailPreferenceRow label="Learning analytics" value="Helps the trail" />
              <TrailPreferenceRow label="Leaderboard visibility" value="Friends only" />
              <TrailPreferenceRow label="Data export" value="Request scroll" href="/feedback" />
            </GlassPanel>

            <SettingsOfflineSection />

            <GlassPanel className="space-y-3 p-4">
              <h3 className="font-sans text-body font-semibold tracking-wide">Support</h3>
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
              <h3 className="font-sans text-body font-semibold tracking-wide">About Noboru</h3>
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
              <h3 className="font-sans text-body font-semibold tracking-wide">Appearance</h3>
              <ThemeSelector value={theme} onChange={updateTheme} disabled={loading} />
              {error ? (
                <p className="text-caption text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </GlassPanel>

            <GlassPanel className="space-y-2 p-4">
              <h3 className="font-sans text-body font-semibold tracking-wide">Daily climb</h3>
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
              <h3 className="font-sans text-body font-semibold tracking-wide">Account</h3>
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
    </SecondaryScreenShell>
  );
}
