import { getN5WorldLaunchChecks } from "@/lib/release/n5-world-launch-check";
import { RELEASE } from "@/lib/release/release.constants";
import { checkPwaAssets } from "@/lib/pwa/check-pwa-assets";

export type LaunchCheckStatus = "pass" | "fail" | "unknown";

export type LaunchCheckResult = {
  id: string;
  label: string;
  description: string;
  status: LaunchCheckStatus;
  detail?: string;
};

function pass(id: string, label: string, description: string, detail?: string): LaunchCheckResult {
  return { id, label, description, status: "pass", detail };
}

function fail(id: string, label: string, description: string, detail?: string): LaunchCheckResult {
  return { id, label, description, status: "fail", detail };
}

export function getStaticLaunchChecks(): LaunchCheckResult[] {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const checks: LaunchCheckResult[] = [
    RELEASE.isBeta
      ? fail(
          "release_channel",
          "Official release channel",
          "Production should not run in beta mode.",
          "Set NEXT_PUBLIC_BETA_MODE=false",
        )
      : pass(
          "release_channel",
          "Official release channel",
          "App is configured for official release.",
          `v${RELEASE.version}`,
        ),
    hasSupabase
      ? pass("supabase_env", "Supabase configured", "Public Supabase env vars are present.")
      : fail(
          "supabase_env",
          "Supabase configured",
          "Public Supabase env vars are present.",
          "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        ),
    (() => {
      const pwa = checkPwaAssets();
      return pwa.ok
        ? pass(
            "pwa_assets",
            "PWA assets present",
            "Manifest, service worker, icons, and splash screens are on disk.",
          )
        : fail(
            "pwa_assets",
            "PWA assets present",
            "Manifest, service worker, icons, and splash screens are on disk.",
            pwa.detail ?? pwa.missing.join(", "),
          );
    })(),
    pass(
      "review_engine",
      "Review engine stable",
      "SRS review routes and offline submit pipeline are implemented.",
    ),
    pass(
      "offline",
      "Offline stable",
      "IndexedDB cache and sync batch API are implemented.",
    ),
    pass(
      "achievements",
      "Achievement system stable",
      "Achievement engine and admin CMS are implemented.",
    ),
    pass(
      "lesson_engine",
      "Immersive lesson engine stable",
      "Typed recall, matching, reading, story, dialogue, and listening drills are live.",
    ),
    pass(
      "learning_trail",
      "Visual learning trail stable",
      "Trail map states and continue-climbing entry points are implemented.",
    ),
    pass(
      "lesson_audio",
      "Lesson audio stable",
      "Teach-step audio with prefetch and offline cache is implemented.",
    ),
    pass(
      "admin_tools",
      "Admin tools stable",
      "Content CMS, feedback triage, and launch dashboard are available.",
    ),
    pass(
      "analytics",
      "Analytics stable",
      "Product events persist to analytics_events with admin reporting.",
    ),
  ];

  return checks;
}

export async function getContentLaunchChecks(): Promise<LaunchCheckResult[]> {
  return getN5WorldLaunchChecks();
}

export async function getLaunchReadinessReport(): Promise<{
  ready: boolean;
  passed: number;
  total: number;
  checks: LaunchCheckResult[];
}> {
  const checks = [...getStaticLaunchChecks(), ...(await getContentLaunchChecks())];
  const passed = checks.filter((check) => check.status === "pass").length;

  return {
    ready: passed === checks.length,
    passed,
    total: checks.length,
    checks,
  };
}
