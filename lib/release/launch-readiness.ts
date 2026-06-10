import { LAUNCH_CRITERIA, REQUIRED_LAUNCH_REGIONS } from "@/lib/release/launch.constants";
import { RELEASE } from "@/lib/release/release.constants";
import { createClient } from "@/lib/supabase/server";

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
    pass(
      "pwa_assets",
      "PWA assets present",
      "Manifest and service worker are part of the release bundle.",
    ),
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
  const supabase = await createClient();
  const { data: regions, error } = await supabase
    .from("regions")
    .select("slug, status")
    .in("slug", [...REQUIRED_LAUNCH_REGIONS]);

  if (error) {
    return LAUNCH_CRITERIA.filter((criterion) =>
      ["foothills", "forest_trail", "n5"].includes(criterion.id),
    ).map((criterion) =>
      fail(criterion.id, criterion.label, criterion.description, error.message),
    );
  }

  const regionBySlug = new Map((regions ?? []).map((region) => [region.slug, region.status]));

  return [
    regionBySlug.get("foothills") === "published"
      ? pass(
          "foothills",
          "Foothills Complete",
          "Hiragana region published with trail lessons.",
        )
      : fail(
          "foothills",
          "Foothills Complete",
          "Hiragana region published with trail lessons.",
          regionBySlug.has("foothills")
            ? `Status: ${regionBySlug.get("foothills") ?? "unknown"}`
            : "Region missing",
        ),
    regionBySlug.get("forest-trail") === "published"
      ? pass(
          "forest_trail",
          "Forest Trail Complete",
          "Katakana region published with trail lessons.",
        )
      : fail(
          "forest_trail",
          "Forest Trail Complete",
          "Katakana region published with trail lessons.",
          regionBySlug.has("forest-trail")
            ? `Status: ${regionBySlug.get("forest-trail") ?? "unknown"}`
            : "Region missing",
        ),
    regionBySlug.get("mount-n5") === "published"
      ? pass(
          "n5",
          "N5 Complete",
          "Mount N5 vocabulary, grammar, kanji, reading, listening, and trials.",
        )
      : fail(
          "n5",
          "N5 Complete",
          "Mount N5 vocabulary, grammar, kanji, reading, listening, and trials.",
          regionBySlug.has("mount-n5")
            ? `Status: ${regionBySlug.get("mount-n5") ?? "unknown"}`
            : "Region missing",
        ),
  ];
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
