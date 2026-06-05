import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai-service";
import { log, logApiError } from "@/lib/logger";
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Return information about the enhanced chat endpoint
    return NextResponse.json({
      success: true,
      endpoint: "chat/enhanced",
      method: "GET",
      description: "Enhanced AI chat endpoint with advanced processing",
      capabilities: [
        "Natural language processing",
        "Context awareness",
        "Multi-model support",
        "Emotion detection",
        "Response optimization"
      ],
      supportedModels: ["auto", "gpt-4", "claude", "local"],
      usage: {
        method: "POST",
        body: {
          message: "string (required)",
          model: "string (optional, default: 'auto')",
          context: "array (optional, previous messages)",
          options: "object (optional, processing options)"
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, model = "auto", context = [], options = {} } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // Use the AI service for enhanced chat processing
    const aiResponse = await aiService.chat(message, context);

    if (!aiResponse.success) {
      return NextResponse.json(
        {
          success: false,
          error: aiResponse.error || "AI service failed",
          model: model
        },
        { status: 500 }
      );
    }

    // Enhanced response with additional processing
    const enhancedResponse = {
      success: true,
      message: message,
      response: aiResponse.content,
      model: model,
      metadata: aiResponse.metadata,
      processing: {
        emotionAnalysis: detectEmotion(message),
        contextLength: context.length,
        processingTime: Date.now(),
        enhanced: true
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(enhancedResponse);
  } catch (error) {
    logApiError("POST", "/api/chat/enhanced", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

function detectEmotion(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('happy') ||
    lowerMessage.includes('excited') ||
    lowerMessage.includes('great') ||
    lowerMessage.includes('wonderful') ||
    lowerMessage.includes('awesome')
  ) {
    return 'positive';
  } else if (
    lowerMessage.includes('sad') ||
    lowerMessage.includes('upset') ||
    lowerMessage.includes('worried') ||
    lowerMessage.includes('angry') ||
    lowerMessage.includes('frustrated')
  ) {
    return 'negative';
  } else if (
    lowerMessage.includes('confused') ||
    lowerMessage.includes('unsure') ||
    lowerMessage.includes('question')
  ) {
    return 'confused';
  } else if (lowerMessage.includes('calm') || lowerMessage.includes('peace')) {
    return 'calm';
  } else if (lowerMessage.includes('excited') || lowerMessage.includes('amazing')) {
    return 'excited';
  }

  return 'neutral';
}
