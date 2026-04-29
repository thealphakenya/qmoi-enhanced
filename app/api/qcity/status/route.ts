/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";
import * as os from "os";

const prodices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more prodices as needed
];

let offloading = true;

export async function GET(_req: NextRequest): any {
  return NextResponse.json({
    prodices,
    offloading,
    activeprodices: prodices.filter((d) => d.status === "online"),
    timestamp: new Date().toISOString(),
  });
}

export async function POST(_req: NextRequest): any {
  const body = await _req.json();
  if (typeof body?.offloading === "boolean") {
    offloading = body.offloading;
  }
  return NextResponse.json({ offloading });
}
