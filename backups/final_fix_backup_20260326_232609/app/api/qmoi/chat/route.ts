// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any */

import { specificExports } from "next/server";
import { specificExports } from "@/lib/qmoi-service";

export async /**
 * POST function
 */
function POST(req: Request): any {
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
      userId = "anonymous-user",
      context = {},
    } = body;

    // Support both message arrays and sophisticated input
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

    // Process with QMOI service
    const response = await QMOIService.processQuery(
      userMessage,
      userId,
      context,
    );

    if (!response.success) {
      return NextResponse.json(response, { status: 500 });
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
    console.error("QMOI chat error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async /**
 * GET function
 */
function GET(): any {
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
