import { NextResponse } from "next/server";
import { getObservabilityOverview } from "@/lib/telemetry/observability";

export async function GET(): Promise<NextResponse> {
  const overview = getObservabilityOverview();
  return NextResponse.json({
    status: "ok",
    version: "v2",
    overview,
    timestamp: new Date().toISOString(),
  });
}
