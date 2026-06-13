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

  async insertBatch(input: {
    userId: string;
    events: AnalyticsEventPayload[];
  }): Promise<string[]> {
    if (input.events.length === 0) return [];

    const supabase = await createClient();
    const rows = input.events.map((event) => ({
      id: crypto.randomUUID(),
      user_id: input.userId,
      name: event.name,
      occurred_at: event.occurredAt,
      properties: event.properties ?? null,
    }));

    const { error } = await supabase.from("analytics_events").insert(rows);
    if (error) throw new Error(error.message);

    return rows.map((row) => row.id);
  }

  async getSummary(limitDays = 7): Promise<AnalyticsSummaryEntry[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_analytics_event_summary", {
      p_limit_days: limitDays,
    });

    if (error) throw new Error(error.message);

    type SummaryRow = { name: string; count: number | string };

    return ((data ?? []) as SummaryRow[]).map((row) => ({
      name: row.name as AnalyticsEventName,
      count: Number(row.count),
    }));
  }
}

export const analyticsRepository = new AnalyticsRepository();
