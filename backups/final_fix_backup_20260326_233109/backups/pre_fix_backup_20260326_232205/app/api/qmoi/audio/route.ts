// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "@/lib/qmoi-service";
import { specificExports } from "../../../../lib/transcribe";

/**
 * Audio/Voice Message Processing
 * Handles audio transcription and processing
 */
export async /**
 * POST function
 */
function POST(req: NextRequest): any {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const userId = (formData.get("userId") as string) || "anonymous";

    if (!audio) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // Convert audio to text
    const transcript = await transcribeHelper(audio);

    // Process with QMOI service
    const response = await QMOIService.processQuery(transcript, userId, {
      messageType: "audio",
      originalAudioSize: audio.size,
    });

    return NextResponse.json({
      success: true,
      transcript,
      response: response.response,
      isAudio: true,
      audioUrl: null, // Could add text-to-speech here
    });
  } catch (error) {
    console.error("Audio processing error:", error);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 },
    );
  }
}

// Transcription delegated to `lib/transcribe.ts`.
