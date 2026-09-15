import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "../../../../lib/security_check";

import { MPesaService } from "../../../../../lib/services/mpesa";
import { MPesaCallbackSchema } from "../../../../../lib/models/mpesa";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate callback data
    const callback = MPesaCallbackSchema.parse(data);

    // Process callback
    const mpesaService = MPesaService.getInstance();
    await mpesaService.handleCallback(callback);

    return new Response("success", { status: 200 });
  } catch (error) {
    globalThis.console.error("MPesa callback error:", error);

    // Log the error but still return success to M-Pesa
    // (M-Pesa will retry on failure responses)
    return new Response("success", { status: 200 });
  }
}
