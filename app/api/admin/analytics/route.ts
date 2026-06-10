import { NextResponse } from "next/server";

import { analyticsRepository } from "@/features/analytics/repositories/analytics.repository";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";

export async function GET() {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  const summary = await analyticsRepository.getSummary();
  return NextResponse.json({ summary, windowDays: 7 });
}
