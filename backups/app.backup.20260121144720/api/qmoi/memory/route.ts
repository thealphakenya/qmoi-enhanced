/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextResponse } from "next/server";

export async function POST(_req: Request) {
  try {
    const body = ((await _req.json()) as any).catch(() => ({}));

    const qbase = process.env.QMOI_API_BASE || "http://127.0.0.1:8080";
    const target = `${qbase}/memory/sync`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // forward memory secret from server env if present
    if (process.env.QMOI_MEMORY_SECRET) {
      headers["X-QMOI-MEMORY-SECRET"] = process.env.QMOI_MEMORY_SECRET;
    }

    const resp = await fetch(target, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    let data: unknown = null;
    try {
      data = await resp.json();
    } catch (e) {
      data = await resp.text();
    }
    return NextResponse.json(data);
  } catch (_e) {
    return NextResponse.json(
      { _error: "memory_proxy_error", detail: String(_e) },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const qbase = process.env.QMOI_API_BASE || "http://127.0.0.1:8080";
    const target = `${qbase}/memory`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (process.env.QMOI_MEMORY_SECRET)
      headers["X-QMOI-MEMORY-SECRET"] = process.env.QMOI_MEMORY_SECRET;
    const resp = await fetch(target, { method: "GET", headers });
    let data: unknown = null;
    try {
      data = await resp.json();
    } catch (e) {
      data = await resp.text();
    }
    return NextResponse.json(data);
  } catch (_e) {
    return NextResponse.json(
      { _error: "memory_fetch_error", detail: String(_e) },
      { status: 500 },
    );
  }
}
