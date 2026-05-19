import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STORAGE_PATH = path.join(process.cwd(), "data", "qcity-schedules.json");
const DEFAULT_SCHEDULES = [
  {
    id: "sched-1001",
    name: "Nightly Health Sync",
    command: "npm run sync:devices",
    cron: "0 2 * * *",
    deviceId: "qcity",
    notify: "ops@qmoi.ai",
    status: "scheduled",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function readSchedules() {
  try {
    if (!fs.existsSync(STORAGE_PATH)) {
      fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true });
      fs.writeFileSync(STORAGE_PATH, JSON.stringify(DEFAULT_SCHEDULES, null, 2));
      return DEFAULT_SCHEDULES;
    }

    const content = fs.readFileSync(STORAGE_PATH, "utf8");
    return JSON.parse(content || "[]");
  } catch (error) {
    return DEFAULT_SCHEDULES;
  }
}

function writeSchedules(items: any[]) {
  fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true });
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(items, null, 2));
}

function requireScheduleAuth(req: NextRequest) {
  const scheduleKey = process.env.QCITY_SCHEDULE_KEY;
  if (!scheduleKey) return { ok: true };
  const auth = req.headers.get("authorization") || "";
  return {
    ok: auth === `Bearer ${scheduleKey}`,
    message: "Unauthorized access to QCity schedule endpoint.",
  };
}

export async function GET(req: NextRequest) {
  const schedules = readSchedules();
  return NextResponse.json({
    success: true,
    endpoint: "/api/qcity/schedule",
    method: "GET",
    items: schedules,
    total: schedules.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const auth = requireScheduleAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.message }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload || !payload.name || !payload.command) {
    return NextResponse.json(
      { success: false, error: "Schedule name and command are required." },
      { status: 400 }
    );
  }

  const schedules = readSchedules();
  const newSchedule = {
    id: `sched-${Date.now()}`,
    name: payload.name,
    command: payload.command,
    cron: payload.cron || "0 0 * * *",
    deviceId: payload.deviceId || "qcity",
    notify: payload.notify || "ops@qmoi.ai",
    status: "scheduled",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  schedules.unshift(newSchedule);
  writeSchedules(schedules);

  return NextResponse.json({
    success: true,
    endpoint: "/api/qcity/schedule",
    method: "POST",
    item: newSchedule,
  });
}

export async function PUT(req: NextRequest) {
  const auth = requireScheduleAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.message }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload || !payload.id) {
    return NextResponse.json(
      { success: false, error: "Schedule id is required for update." },
      { status: 400 }
    );
  }

  const schedules = readSchedules();
  const index = schedules.findIndex((item: any) => item.id === payload.id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: "Schedule not found." }, { status: 404 });
  }

  schedules[index] = {
    ...schedules[index],
    ...payload.form,
    updatedAt: new Date().toISOString(),
  };
  writeSchedules(schedules);

  return NextResponse.json({
    success: true,
    endpoint: "/api/qcity/schedule",
    method: "PUT",
    item: schedules[index],
  });
}

export async function DELETE(req: NextRequest) {
  const auth = requireScheduleAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.message }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload || !payload.id) {
    return NextResponse.json(
      { success: false, error: "Schedule id is required for deletion." },
      { status: 400 }
    );
  }

  let schedules = readSchedules();
  const beforeCount = schedules.length;
  schedules = schedules.filter((item: any) => item.id !== payload.id);
  if (schedules.length === beforeCount) {
    return NextResponse.json({ success: false, error: "Schedule not found." }, { status: 404 });
  }

  writeSchedules(schedules);

  return NextResponse.json({
    success: true,
    endpoint: "/api/qcity/schedule",
    method: "DELETE",
    id: payload.id,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = requireScheduleAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.message }, { status: 401 });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const payload = await req.json().catch(() => null);

  if (action === "run") {
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, error: "Schedule id is required to run." },
        { status: 400 }
      );
    }

    const schedules = readSchedules();
    const index = schedules.findIndex((item: any) => item.id === payload.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Schedule not found." }, { status: 404 });
    }

    schedules[index] = {
      ...schedules[index],
      status: "running",
      updatedAt: new Date().toISOString(),
    };
    writeSchedules(schedules);

    return NextResponse.json({
      success: true,
      endpoint: "/api/qcity/schedule",
      method: "PATCH",
      action: "run",
      item: schedules[index],
      message: `Schedule ${payload.id} started successfully.`,
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: "Unsupported patch action.",
      action,
    },
    { status: 400 }
  );
}
