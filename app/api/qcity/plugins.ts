import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PLUGINS = [
  {
    id: "plugin-analytics",
    name: "Analytics Adapter",
    version: "1.3.2",
    status: "active",
    description: "Real-time analytics integration for QCity dashboards.",
  },
  {
    id: "plugin-security",
    name: "Security Sentinel",
    version: "2.0.1",
    status: "active",
    description: "Monitors device health and access policies across the grid.",
  },
  {
    id: "plugin-routing",
    name: "Routing Optimizer",
    version: "4.1.0",
    status: "inactive",
    description: "Dynamic route planning and traffic signal orchestration.",
  },
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    endpoint: "/api/qcity/plugins",
    method: "GET",
    plugins: PLUGINS,
    count: PLUGINS.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== "string") {
    return NextResponse.json(
      {
        success: false,
        error: "Plugin name is required",
      },
      { status: 400 }
    );
  }

  const newPlugin = {
    id: `plugin-${Date.now()}`,
    name: body.name,
    version: body.version || "1.0.0",
    status: body.status || "pending",
    description: body.description || "User-installed plugin",
  };

  return NextResponse.json({
    success: true,
    endpoint: "/api/qcity/plugins",
    method: "POST",
    plugin: newPlugin,
    message: "Plugin registered successfully. Persistent storage is managed by the production environment.",
    timestamp: new Date().toISOString(),
  });
}
