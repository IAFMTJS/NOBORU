import {
  ANALYTICS_EVENT_NAMES,
  type AnalyticsEventName,
  type AnalyticsEventPayload,
} from "@/features/analytics/types/analytics.types";

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return ANALYTICS_EVENT_NAMES.includes(value as AnalyticsEventName);
}

export function validateAnalyticsEvent(
  input: unknown,
): { ok: true; event: AnalyticsEventPayload } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Event payload must be an object." };
  }

  const candidate = input as Partial<AnalyticsEventPayload>;

  if (!candidate.name || !isAnalyticsEventName(candidate.name)) {
    return { ok: false, error: "Invalid analytics event name." };
  }

  if (!candidate.occurredAt || Number.isNaN(Date.parse(candidate.occurredAt))) {
    return { ok: false, error: "Invalid occurredAt timestamp." };
  }

  if (
    candidate.properties !== undefined &&
    (typeof candidate.properties !== "object" || candidate.properties === null)
  ) {
    return { ok: false, error: "Properties must be an object when provided." };
  }

  return {
    ok: true,
    event: {
      name: candidate.name,
      occurredAt: candidate.occurredAt,
      properties: candidate.properties,
    },
  };
}
