"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { analyticsService } from "@/features/analytics/services/analytics.service";
import type { AnalyticsEventName } from "@/features/analytics/types/analytics.types";

type AnalyticsLinkProps = ComponentProps<typeof Link> & {
  eventName: AnalyticsEventName;
  eventProperties?: Record<string, string | number | boolean | null>;
};

export function AnalyticsLink({
  eventName,
  eventProperties,
  onClick,
  ...props
}: AnalyticsLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        void analyticsService.track({
          name: eventName,
          properties: eventProperties,
        });
        onClick?.(event);
      }}
    />
  );
}
