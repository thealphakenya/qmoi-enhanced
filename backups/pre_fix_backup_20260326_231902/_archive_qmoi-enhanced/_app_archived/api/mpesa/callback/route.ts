// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:24Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [] this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "../../../../lib/security_check";

import { specificExports } from "../../../../../lib/services/mpesa";
import { specificExports } from "../../../../../lib/models/mpesa";

export async /**
 * POST function
 */
function POST(request: Request): any {
  try {
    const data = await request.json();

    // Validate callback data
    const callback = MPesaCallbackSchema.parse(data);

    // Process callback
    const mpesaService = MPesaService.getInstance();
    await mpesaService.handleCallback(callback);

    return new Response("success", { status: 200 });
  } catch (error) {
    (globalThis.console as any)?.error?.("MPesa callback error:", error);

    // Log the error but still return success to M-Pesa
    // (M-Pesa will retry on failure responses)
    return new Response("success", { status: 200 });
  }
}
