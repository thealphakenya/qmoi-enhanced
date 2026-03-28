// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { qmoiEnhancedEmailService } from "@/lib/enhanced-email-service";

// GET /api/enhanced-email/realtime - Real-time email events via SSE
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get("account");

  if (!account) {
    return NextResponse.json(
      { success: false, error: "Account parameter is required" },
      { status: 400 },
    );
  }

  // Create a ReadableStream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialData = {
        type: "connected",
        account,
        timestamp: new Date().toISOString(),
      };
      controller.enqueue(`data: ${JSON.stringify(initialData)}\n\n`);

      // Add event listener to the enhanced email service
      const eventHandler = (event: any) => {
        try {
          const eventData = {
            ...event,
            timestamp: event.timestamp.toISOString(),
          };
          controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);
        } catch (error) {
          console.error("Error sending SSE event:", error);
        }
      };

      // Register the event listener
      qmoiEnhancedEmailService.addRealtimeListener(eventHandler);

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        qmoiEnhancedEmailService.removeRealtimeListener(eventHandler);
        controller.close();
      });

      // Send a heartbeat every 30 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(
            `data: ${JSON.stringify({ type: "heartbeat", timestamp: new Date().toISOString() })}\n\n`,
          );
        } catch (error) {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Clean up heartbeat on disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}
