import { NextResponse } from "next/server";

import { analyticsRepository } from "@/features/analytics/repositories/analytics.repository";
import { validateAnalyticsEvent } from "@/features/analytics/services/analytics-validation";
import { checkRateLimit, rateLimitKey } from "@/lib/api/rate-limit";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await checkRateLimit(rateLimitKey(user.id, "analytics-batch"), 120, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const candidate = body as { events?: unknown };
  if (!Array.isArray(candidate.events) || candidate.events.length === 0) {
    return NextResponse.json({ error: "Events array is required." }, { status: 400 });
  }

  const MAX_ANALYTICS_BATCH_SIZE = 50;
  if (candidate.events.length > MAX_ANALYTICS_BATCH_SIZE) {
    return NextResponse.json(
      { error: `Events batch exceeds maximum size of ${MAX_ANALYTICS_BATCH_SIZE}.` },
      { status: 400 },
    );
  }

  const validated = candidate.events.map((event) => validateAnalyticsEvent(event));
  const invalid = validated.find((result) => !result.ok);
  if (invalid && !invalid.ok) {
    return NextResponse.json({ error: invalid.error }, { status: 400 });
  }

  const events = validated
    .filter((result): result is Extract<typeof result, { ok: true }> => result.ok)
    .map((result) => result.event);

  try {
    const eventIds = await analyticsRepository.insertBatch({
      userId: user.id,
      events,
    });

    if (process.env.NODE_ENV !== "production") {
      console.info("[analytics:batch]", {
        userId: user.id,
        count: events.length,
        eventIds,
      });
    }

    return NextResponse.json(
      {
        accepted: true,
        count: events.length,
        eventIds,
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("[analytics] Failed to persist batch:", error);
    return NextResponse.json(
      { error: "Failed to record analytics events." },
      { status: 500 },
    );
  }
}
