import { createClient } from "@/lib/supabase/server";

import type {
  AnalyticsEventName,
  AnalyticsEventPayload,
} from "@/features/analytics/types/analytics.types";

export type AnalyticsEventRow = {
  id: string;
  user_id: string;
  name: string;
  occurred_at: string;
  properties: Record<string, unknown> | null;
  created_at: string;
};

export type AnalyticsSummaryEntry = {
  name: AnalyticsEventName;
  count: number;
};

class AnalyticsRepository {
  async insert(input: {
    userId: string;
    eventId: string;
    event: AnalyticsEventPayload;
  }): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("analytics_events").insert({
      id: input.eventId,
      user_id: input.userId,
      name: input.event.name,
      occurred_at: input.event.occurredAt,
      properties: input.event.properties ?? null,
    });

    if (error) throw new Error(error.message);
  }

  async getSummary(limitDays = 7): Promise<AnalyticsSummaryEntry[]> {
    const supabase = await createClient();
    const since = new Date();
    since.setDate(since.getDate() - limitDays);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("name")
      .gte("occurred_at", since.toISOString());

    if (error) throw new Error(error.message);

    const counts = new Map<string, number>();
    for (const row of data ?? []) {
      counts.set(row.name, (counts.get(row.name) ?? 0) + 1);
    }

    return [...counts.entries()]
      .map(([name, count]) => ({
        name: name as AnalyticsEventName,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }
}

export const analyticsRepository = new AnalyticsRepository();
