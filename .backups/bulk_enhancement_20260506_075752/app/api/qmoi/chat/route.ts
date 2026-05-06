import { NextRequest, NextResponse } from "next/server";
import { processQmoiQuery } from "@/lib/qmoi-chat-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch (_error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    messages,
    input,
    sessionId,
    userId = "anonymous-user",
    context = {},
  } = body || {};

  let userMessage = typeof input === "string" && input.trim() ? input.trim() : "";
  if (!userMessage && Array.isArray(messages) && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    userMessage = String(lastMessage?.content || lastMessage?.text || "").trim();
  }

  if (!userMessage) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  try {
    const response = processQmoiQuery(userMessage, userId, { sessionId, ...context });

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          error: response.message || "Failed to process query",
          response,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: response.message,
      response: response.response,
      confidence: response.confidence,
      metadata: response.metadata,
      advanced: response.advanced,
      choices: [
        {
          message: {
            role: "assistant",
            content: response.response,
          },
        },
      ],
    });
  } catch (_error){
    console._error("QMOI chat _error:", _error);
    return NextResponse.json(
      {
        _error: "Internal server _error",
        message: _error instanceof Error ? _error.message : "Unknown _error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "QMOI Chat API",
    version: "2.0.1",
    model: "qmoi-enhanced",
    capabilities: [
      "conversation",
      "memory-integration",
      "qvillage-features",
      "biometric-aware",
      "real-time-response",
    ],
  });
}
