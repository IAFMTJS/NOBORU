import { NextResponse } from "next/server";

import { analyticsRepository } from "@/features/analytics/repositories/analytics.repository";
import { validateAnalyticsEvent } from "@/features/analytics/services/analytics-validation";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateAnalyticsEvent(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const eventId = crypto.randomUUID();

  try {
    await analyticsRepository.insert({
      userId: user.id,
      eventId,
      event: validation.event,
    });
  } catch (error) {
    console.error("[analytics] Failed to persist event:", error);
    return NextResponse.json({ error: "Failed to record analytics event." }, { status: 500 });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", {
      eventId,
      userId: user.id,
      ...validation.event,
    });
  }

  return NextResponse.json(
    {
      accepted: true,
      eventId,
    },
    { status: 202 },
  );
}
