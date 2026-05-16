// [] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "@/scripts/services/qcity_service";

export async /**
 * GET function
 */
function GET(_req: NextRequest): any {
  const qcityService = new QCityService();
  await qcityService.initialize();
  const status = qcityService.getStatus();
  const prodices = await qcityService.getprodiceList();
  const resources = await qcityService.getResourceStats();
  return new Response(JSON.stringify({ status, prodices, resources }), {
    headers: { "Content-Type": "application/json" },
  });
}
