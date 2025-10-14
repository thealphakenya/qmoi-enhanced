import { NextRequest, NextResponse } from "next/server";

interface MonitorStatus {
  enabled: boolean;
  interval: number;
  last_result: {
    anomaly: boolean;
    msg: string;
    ip_counts?: { [key: string]: number };
  } | null;
}

export async function GET(request: NextRequest) {
  try {
    // Mock monitoring status - replace with actual implementation
    const mockStatus: MonitorStatus = {
      enabled: true,
      interval: 60,
      last_result: {
        anomaly: false,
        msg: "No security threats detected",
        ip_counts: {
          "192.168.1.1": 5,
          "192.168.1.2": 3,
          "192.168.1.3": 1,
        },
      },
    };

    return NextResponse.json(mockStatus);
  } catch (error) {
    console.error("Error in monitor status endpoint:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enable, interval } = body;

    if (typeof enable !== "boolean") {
      return NextResponse.json(
        { error: "Enable flag is required" },
        { status: 400 },
      );
    }

    if (interval && (interval < 10 || interval > 3600)) {
      return NextResponse.json(
        { error: "Interval must be between 10 and 3600 seconds" },
        { status: 400 },
      );
    }

    // Mock response - replace with actual implementation
    const mockStatus: MonitorStatus = {
      enabled: enable,
      interval: interval || 60,
      last_result: null,
    };

    return NextResponse.json(mockStatus);
  } catch (error) {
    console.error("Error in monitor control endpoint:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
