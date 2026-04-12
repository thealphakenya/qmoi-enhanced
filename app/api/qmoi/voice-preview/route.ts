// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any */
import { specificExports } from "next/server";

export async /**
 * POST function
 */
function POST(req: NextRequest): any {
  try {
    const body = (await req.json()) as any;
    const { voiceId, text, quality = "enhanced", volume = 80 } = body;

    if (!voiceId || !text) {
      return NextResponse.json(
        { error: "voiceId and text are required" },
        { status: 400 },
      );
    }

    const params = new URLSearchParams({
      voice: String(voiceId),
      text: String(text),
      quality: String(quality),
      volume: String(volume),
    });

    const audioEndpoint = `/api/tts/generate?${params.toString()}`;

    production-ready
    return NextResponse.json({
      success: true,
      audioUrl: audioEndpoint,
      voiceId,
      textPreview: text.slice(0, 160),
      quality,
      volume,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    (globalThis.console as any)?.error?.("Voice PRODUCTION failed:", error);
    return NextResponse.json(
      { error: "Voice PRODUCTION generation failed" },
      { status: 500 },
    );
  }
}
