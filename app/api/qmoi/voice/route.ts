// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { voiceService } from "@/lib/voice-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");

    if (action === "history" && userId) {
      const history = await voiceService.getVoiceMessages(userId);
      return NextResponse.json({
        success: true,
        history,
        count: history.length,
      });
    }

    if (action === "session" && userId) {
      const session = await voiceService.getActiveVoiceSession(userId);
      return NextResponse.json({
        success: true,
        session,
      });
    }

    // Default response
    return NextResponse.json({
      success: true,
      message: "Voice service is operational",
      capabilities: [
        "speech-to-text",
        "text-to-speech",
        "voice-commands",
        "session-management",
      ],
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
    const { action, userId, sessionId, audioData, text, language } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    if (action === "start-session") {
      const session = await voiceService.startVoiceSession(
        userId,
        language || "en",
      );
      return NextResponse.json({
        success: true,
        session,
        message: "Voice session started",
      });
    }

    if (action === "end-session" && sessionId) {
      await voiceService.endVoiceSession(sessionId);
      return NextResponse.json({
        success: true,
        message: "Voice session ended",
      });
    }

    if (action === "process-audio" && sessionId && audioData) {
      // Convert base64 audio data to Buffer
      const audioBuffer = Buffer.from(audioData, "base64");
      const message = await voiceService.processVoiceMessage(
        sessionId,
        audioBuffer,
        userId,
        language || "en",
      );
      return NextResponse.json({
        success: true,
        message,
        transcription: message.transcription,
      });
    }

    if (action === "generate-response" && text) {
      const audioBuffer = await voiceService.generateVoiceResponse(
        text,
        language || "en",
      );
      return NextResponse.json({
        success: true,
        audioData: audioBuffer.toString("base64"),
        message: "Voice response generated",
      });
    }

    if (action === "analyze-command" && text) {
      
      const voiceCommand = {
        id: "temp",
        userId,
        content: text,
        timestamp: new Date().toISOString(),
        language: language || "en",
        confidence: 0.9,
        sentiment: "neutral" as const,
        isProcessed: true,
      };
      const analysis = await voiceService.analyzeVoiceCommand(voiceCommand);
      return NextResponse.json({
        success: true,
        analysis,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
