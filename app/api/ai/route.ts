/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { QMOIService } from "@/lib/qmoi-service";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (_e) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const {
      messages,
      input,
      sessionId = `session-${Date.now()}`,
      userId = "anonymous",
      context = {},
    } = body;

    let userMessage = input;
    if (
      !userMessage &&
      messages &&
      Array.isArray(messages) &&
      messages.length > 0
    ) {
      const lastMsg = messages[messages.length - 1];
      userMessage = lastMsg.content || lastMsg.text || "";
    }

    if (!userMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 },
      );
    }

    const response = await QMOIService.processMessage(
      userMessage,
      sessionId,
      userId,
      context,
    );

    if (!response || !response.success) {
      return NextResponse.json(
        { error: "QMOI service error", details: response },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ...response,
      choices: [
        {
          message: {
            role: "assistant",
            content: response.message,
          },
        },
      ],
    });
  } catch (error) {
    console.error("/api/ai error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "QMOI /api/ai Bridge",
    version: "1.0.0",
    implemented: true,
    route: "/api/ai",
  });
}
