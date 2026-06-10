import type { AnalyticsEventPayload } from "@/features/analytics/types/analytics.types";

type TrackAnalyticsEventInput = {
  name: AnalyticsEventPayload["name"];
  properties?: AnalyticsEventPayload["properties"];
};

class AnalyticsService {
  async track(input: TrackAnalyticsEventInput): Promise<void> {
    const payload: AnalyticsEventPayload = {
      name: input.name,
      occurredAt: new Date().toISOString(),
      properties: input.properties,
    };

    if (typeof window === "undefined") {
      return;
    }

    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      // Analytics must never block learning flows.
    }
  }
}

export const analyticsService = new AnalyticsService();
