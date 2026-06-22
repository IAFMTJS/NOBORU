import { LAUNCH_CRITERIA } from "@/lib/release/launch.constants";
import { createClient } from "@/lib/supabase/server";

import type { LaunchCheckResult } from "./launch-readiness";

function pass(id: string, label: string, description: string, detail?: string): LaunchCheckResult {
  return { id, label, description, status: "pass", detail };
}

function fail(id: string, label: string, description: string, detail?: string): LaunchCheckResult {
  return { id, label, description, status: "fail", detail };
}

export async function getN5WorldLaunchChecks(): Promise<LaunchCheckResult[]> {
  const criterion = LAUNCH_CRITERIA.find((entry) => entry.id === "n5_world");
  if (!criterion) return [];

  const supabase = await createClient();
  const { data: region, error: regionError } = await supabase
    .from("regions")
    .select("id, slug, status")
    .eq("slug", "n5")
    .maybeSingle();

  if (regionError) {
    return [fail(criterion.id, criterion.label, criterion.description, regionError.message)];
  }

  if (!region || region.status !== "published") {
    return [
      fail(
        criterion.id,
        criterion.label,
        criterion.description,
        region ? `Status: ${region.status}` : "Region missing",
      ),
    ];
  }

  const failures: string[] = [];

  const { data: actRows, error: actError } = await supabase
    .from("units")
    .select("act_index")
    .eq("region_id", region.id);

  if (actError) {
    failures.push(`units.act_index: ${actError.message}`);
  } else {
    const acts = new Set((actRows ?? []).map((row) => row.act_index).filter(Boolean));
    for (const required of [1, 2, 3] as const) {
      if (!acts.has(required)) {
        failures.push(`Missing act_index ${required} on n5 units`);
      }
    }
  }

  const { count: trialCount, error: trialError } = await supabase
    .from("trial_templates")
    .select("id", { count: "exact", head: true })
    .eq("region_slug", "n5")
    .eq("status", "published");

  if (trialError) {
    failures.push(`trials: ${trialError.message}`);
  } else if ((trialCount ?? 0) < 5) {
    failures.push(`Expected 5 published N5 trials, found ${trialCount ?? 0}`);
  }

  const { count: landmarkCount, error: landmarkError } = await supabase
    .from("journey_landmarks")
    .select("id", { count: "exact", head: true })
    .eq("region_id", region.id)
    .eq("status", "published");

  if (landmarkError) {
    if (!landmarkError.message.includes("does not exist")) {
      failures.push(`landmarks: ${landmarkError.message}`);
    }
  } else if ((landmarkCount ?? 0) < 8) {
    failures.push(`Expected 8+ published N5 landmarks, found ${landmarkCount ?? 0}`);
  }

  if (failures.length > 0) {
    return [fail(criterion.id, criterion.label, criterion.description, failures.join("; "))];
  }

  return [
    pass(
      criterion.id,
      criterion.label,
      criterion.description,
      "n5 published with acts, trials, and landmarks",
    ),
  ];
}
