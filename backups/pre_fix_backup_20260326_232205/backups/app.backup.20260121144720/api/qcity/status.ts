// 
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest } from "next/server";
import { QCityService } from "@/scripts/services/qcity_service";

export async function GET(_req: NextRequest) {
  const qcityService = new QCityService();
  await qcityService.initialize();
  const status = qcityService.getStatus();
  const devices = await qcityService.getDeviceList();
  const resources = await qcityService.getResourceStats();
  return new Response(JSON.stringify({ status, devices, resources }), {
    headers: { "Content-Type": "application/json" },
  });
}
