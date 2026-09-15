import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  loadAutomationConfig,
  validateAutomationConfig,
  type AutomationConfig,
} from "@/lib/qmoi-automation-config";
import {
  updateAutomationConfig,
  getAutomationConfig,
} from "@/lib/qmoi-automation-manager";

async function verifyAdminAccess(request: Request) {
  const headersList = await headers();
  const token = headersList.get("authorization")?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  if (!(await verifyAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const config = await getAutomationConfig();

    return NextResponse.json({
      success: true,
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get automation configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Validate configuration
    const validation = validateAutomationConfig(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Invalid configuration",
          details: validation.errors,
        },
        { status: 400 },
      );
    }

    // Update configuration
    await updateAutomationConfig(body as Partial<AutomationConfig>);
    const newConfig = await getAutomationConfig();

    return NextResponse.json({
      success: true,
      message: "Configuration updated successfully",
      config: newConfig,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update automation configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Validate configuration
    const validation = validateAutomationConfig(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Invalid configuration",
          details: validation.errors,
        },
        { status: 400 },
      );
    }

    // Update configuration (same as POST)
    await updateAutomationConfig(body as Partial<AutomationConfig>);
    const newConfig = await getAutomationConfig();

    return NextResponse.json({
      success: true,
      message: "Configuration updated successfully",
      config: newConfig,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update automation configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // Reset to default configuration
    const defaultConfig = loadAutomationConfig();
    await updateAutomationConfig(defaultConfig);

    return NextResponse.json({
      success: true,
      message: "Configuration reset to defaults",
      config: defaultConfig,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reset automation configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
