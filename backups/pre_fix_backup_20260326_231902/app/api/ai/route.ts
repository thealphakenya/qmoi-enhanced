// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [] this file has no remaining production markers
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

    const response = await qmoiService.processRequest({ prompt: userMessage });

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
    logger.error("/api/ai error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
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
    name: "QMOI /api/ai Bridge",
    version: "1.0.0",
    implemented: true,
    route: "/api/ai",
  });
}
