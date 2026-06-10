import { NextResponse } from "next/server";

import { getLaunchReadinessReport } from "@/lib/release/launch-readiness";
import { requireContentAdminSession } from "@/lib/admin/require-content-admin";

export async function GET() {
  const { error } = await requireContentAdminSession();
  if (error) return error;

  const report = await getLaunchReadinessReport();
  return NextResponse.json(report);
}
