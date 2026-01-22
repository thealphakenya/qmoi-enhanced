/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { QMOIVoiceService } from "@/lib/voice-service";

export async function GET() {
  try {
    const voiceService = QMOIVoiceService.getInstance();
    const voices = voiceService.getAvailableVoices();
    const preferences = voiceService.getPreferences();

    return NextResponse.json({
      success: true,
      voices,
      preferences,
      message: "Voice profiles retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, voiceId, pitch, rate, volume, text } = body;

    const voiceService = QMOIVoiceService.getInstance();

    switch (action) {
      case "select-voice":
        if (!voiceId)
          return NextResponse.json(
            { error: "voiceId required" },
            { status: 400 },
          );
        const selected = voiceService.selectVoice(voiceId);
        if (!selected)
          return NextResponse.json(
            { error: "Voice not found" },
            { status: 404 },
          );
        return NextResponse.json({
          success: true,
          message: "Voice selected successfully",
          preferences: voiceService.getPreferences(),
        });

      case "set-pitch":
        if (pitch === undefined)
          return NextResponse.json(
            { error: "pitch required" },
            { status: 400 },
          );
        voiceService.setPitch(pitch);
        return NextResponse.json({
          success: true,
          message: "Pitch updated",
          preferences: voiceService.getPreferences(),
        });

      case "set-rate":
        if (rate === undefined)
          return NextResponse.json({ error: "rate required" }, { status: 400 });
        voiceService.setRate(rate);
        return NextResponse.json({
          success: true,
          message: "Rate updated",
          preferences: voiceService.getPreferences(),
        });

      case "set-volume":
        if (volume === undefined)
          return NextResponse.json(
            { error: "volume required" },
            { status: 400 },
          );
        voiceService.setVolume(volume);
        return NextResponse.json({
          success: true,
          message: "Volume updated",
          preferences: voiceService.getPreferences(),
        });

      case "synthesize":
        if (!text || !voiceId) {
          return NextResponse.json(
            { error: "text and voiceId required" },
            { status: 400 },
          );
        }
        const result = await voiceService.synthesize({
          text,
          voiceId,
          pitch,
          rate,
          volume,
        });
        return NextResponse.json({
          success: result.success,
          message: result.success ? "Synthesis completed" : result.error,
          data: result,
        });

      case "stop":
        voiceService.stopSpeech();
        return NextResponse.json({
          success: true,
          message: "Speech stopped",
        });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
