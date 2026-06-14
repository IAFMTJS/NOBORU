"use client";

import Link from "next/link";
import { useMemo } from "react";

import { RegionHeroImage } from "@/components/media/region-hero-image";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ListRow } from "@/components/ui/list-row";
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
import type { SettingsViewModel } from "@/features/settings/types/settings.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";

type SettingsScreenProps = {
  settings: SettingsViewModel;
};

export function SettingsScreen({ settings }: SettingsScreenProps) {
  const { theme, updateTheme, loading, error } = useThemeSetting(
    settings.theme,
  );
  const { logout, loading: logoutLoading, error: logoutError } = useLogout();
  const yama = useMemo(() => yamaService.resolveProfilePresence(), []);

  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <RegionHeroImage
          regionSlug="foothills"
          alt=""
          className="absolute inset-0 h-full min-h-dvh rounded-none"
          hideOverlay
        />
      }
    >
      <PageContainer>
        <header className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <StoryTitle as="h1" className="text-xl">
              Settings
            </StoryTitle>
            <p className="text-body-sm text-muted-foreground">
              Trail preferences and account
            </p>
          </div>
          <Link
            href="/profile"
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-glass-border bg-glass-bg/80 px-3 text-body-sm font-medium backdrop-blur-md"
            aria-label="Back to profile"
          >
            ←
          </Link>
        </header>

        <GlassPanel className="p-4">
          <YamaPresence
            presence={yama}
            size="sm"
            layout="horizontal"
            bubbleClassName="border-glass-border bg-glass-bg/80"
          />
        </GlassPanel>

        <PwaInstallPrompt />
        <OfflineSyncPanel />

        <GlassPanel className="space-y-3 p-4">
          <StoryTitle as="h3" className="text-sm normal-case tracking-wide">
            Support
          </StoryTitle>
          <ListRow
            primary="Send feedback"
            secondary="Report bugs, trail UX, audio, or PWA issues"
            onClick={() => {
              window.location.href = "/feedback";
            }}
          />
          {BETA_RELEASE.enabled ? (
            <p className="text-caption text-muted-foreground">
              Public beta {BETA_RELEASE.version}
            </p>
          ) : null}
        </GlassPanel>

        <GlassPanel className="space-y-2 p-4">
          <StoryTitle as="h3" className="text-sm normal-case tracking-wide">
            About
          </StoryTitle>
          <ListRow
            primary={RELEASE.name}
            secondary={
              BETA_RELEASE.enabled
                ? `Beta ${BETA_RELEASE.version}`
                : `${OFFICIAL_RELEASE.label} v${RELEASE.version}`
            }
          />
          <ListRow primary="Launch date" secondary={RELEASE.launchedAt} />
        </GlassPanel>

        <GlassPanel className="space-y-3 p-4">
          <StoryTitle as="h3" className="text-sm normal-case tracking-wide">
            Appearance
          </StoryTitle>
          <div className="space-y-2">
            <p className="text-body-sm font-medium">Theme</p>
            <p className="text-caption">
              Mountain Dawn, Mountain Night, or match your device
            </p>
            <ThemeSelector
              value={theme}
              onChange={updateTheme}
              disabled={loading}
            />
          </div>
          {error ? (
            <p className="text-caption text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </GlassPanel>

        <GlassPanel className="space-y-2 p-4">
          <StoryTitle as="h3" className="text-sm normal-case tracking-wide">
            Study
          </StoryTitle>
          <ListRow
            primary="Daily goal"
            secondary={`${settings.dailyGoalMinutes} min`}
          />
          <ListRow
            primary="Notifications"
            secondary={settings.notificationsEnabled ? "Enabled" : "Disabled"}
          />
          <ListRow
            primary="Sound"
            secondary={settings.soundEnabled ? "Enabled" : "Disabled"}
          />
        </GlassPanel>

        <GlassPanel className="space-y-3 p-4">
          <StoryTitle as="h3" className="text-sm normal-case tracking-wide">
            Account
          </StoryTitle>
          <ListRow primary="Email" secondary={settings.email} />
          <ListRow
            primary="Change password"
            secondary="Reset via email link"
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
      </PageContainer>
    </IllustratedScreen>
  );
}
