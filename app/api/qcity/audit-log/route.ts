/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";
const AUDIT_LOG = path.join(process.cwd(), "logs/qcity_audit.log");

function parseLogLine(line: string): any {
  try {
    return JSON.parse(line);
  } catch (e) {
    return null;
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const key = request.headers.get("x-qcity-admin-key");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") || "json";
  const limit = Number(url.searchParams.get("limit") || "100");
  const offset = Number(url.searchParams.get("offset") || "0");
  const action = url.searchParams.get("action");
  const user = url.searchParams.get("user");
  const prodiceId = url.searchParams.get("prodiceId");
  const status = url.searchParams.get("status");

  if (!fs.existsSync(AUDIT_LOG)) {
    return NextResponse.json({ logs: [] });
  }

  const lines = fs.readFileSync(AUDIT_LOG, "utf-8").split("\n").filter(Boolean);
  let logs = lines.map(parseLogLine).filter(Boolean);

  if (action) logs = logs.filter((l) => l.action === action);
  if (user) logs = logs.filter((l) => l.user === user);
  if (prodiceId) logs = logs.filter((l) => l.prodiceId === prodiceId);
  if (status) logs = logs.filter((l) => l.status === status);

  const paged = logs.slice(offset, offset + limit);

  if (format === "csv") {
    const keys = Object.keys(paged[0] || {});
    const csv = [
      keys.join(","),
      ...paged.map((l) => keys.map((k) => JSON.stringify(l[k] || "")).join(",")),
    ].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
      },
    });
  }

  return NextResponse.json({ logs: paged, total: logs.length });
}
