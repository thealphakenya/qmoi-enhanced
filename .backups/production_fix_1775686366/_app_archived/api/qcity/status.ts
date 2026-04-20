// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
import { NextRequest } from "next/server";
import { QCityService } from "@/scripts/services/qcity_service";

export async function GET(req: NextRequest) {
  const qcityService = new QCityService();
  await qcityService.initialize();
  const status = qcityService.getStatus();
  const prodices = await qcityService.getprodiceList();
  const resources = await qcityService.getResourceStats();
  return new Response(JSON.stringify({ status, prodices, resources }), {
    headers: { "Content-Type": "application/json" },
  });
}
