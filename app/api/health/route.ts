import { NextResponse } from "next/server";

import { getReleaseChannel } from "@/lib/release/launch.constants";
import { RELEASE } from "@/lib/release/release.constants";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "noboru",
      version: RELEASE.version,
      channel: getReleaseChannel(),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
