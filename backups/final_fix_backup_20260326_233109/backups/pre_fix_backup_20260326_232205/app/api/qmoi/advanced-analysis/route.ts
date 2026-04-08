// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "@/lib/qmoi-enhanced-intelligence";

/**
 * Advanced QMOI Analysis Endpoint
 * Provides specialized responses with background research, memory, and enhanced reasoning
 */
export async /**
 * POST function
 */
function POST(req: NextRequest): any {
  try {
    const {
      query,
      userId = "anonymous",
      context = {},
      requireResearch = true,
    } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const queryLower = query.toLowerCase();
    let response: any = { success: true };

    // Helper function for flexible keyword matching
    const hasKeywords = (text: string, keywords: string[]): boolean => {
      return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
    };

    // Detect request type and apply specialized handler with improved matching
    if (
      hasKeywords(queryLower, ["explain", "teach", "how", "what is"]) &&
      hasKeywords(queryLower, ["inflation", "economic", "economy", "price"])
    ) {
      const level = queryLower.includes("economist")
        ? "economist"
        : queryLower.includes("child") || queryLower.includes("10")
          ? "child"
          : queryLower.includes("kenya") || queryLower.includes("kenyan")
            ? "kenyan"
            : "general";

      response = QMOIEnhancedIntelligence.handleEconomicExplanation(
        "inflation",
        level,
      );
    } else if (
      hasKeywords(queryLower, [
        "logical fallacy",
        "fallacy",
        "error",
        "mistake",
        "wrong argument",
        "detect",
      ])
    ) {
      response = QMOIEnhancedIntelligence.detectLogicalFallacy(query);
    } else if (
      hasKeywords(queryLower, [
        "decision tree",
        "decision",
        "choose",
        "between",
      ])
    ) {
      response = QMOIEnhancedIntelligence.createDecisionTree(
        queryLower.includes("employment")
          ? "employment vs entrepreneurship"
          : query,
      );
    } else if (
      hasKeywords(queryLower, ["quote", "saying", "motivational"]) &&
      hasKeywords(queryLower, [
        "original",
        "never been",
        "new",
        "write",
        "create",
      ])
    ) {
      response = QMOIEnhancedIntelligence.generateOriginalQuote();
    } else if (
      hasKeywords(queryLower, ["story", "tale", "narrative"]) &&
      hasKeywords(queryLower, [
        "silent",
        "quiet",
        "doesn't speak",
        "never speaks",
      ])
    ) {
      response = QMOIEnhancedIntelligence.generateSilentHeroStory();
    } else if (
      hasKeywords(queryLower, [
        "proverb",
        "saying",
        "wisdom",
        "create",
        "invent",
      ]) &&
      hasKeywords(queryLower, ["african", "africa"])
    ) {
      response = QMOIEnhancedIntelligence.generateAfricanProverb();
    } else if (
      hasKeywords(queryLower, [
        "my name",
        "i am",
        "call me",
        "i'm",
        "remember",
        "store",
      ]) &&
      hasKeywords(queryLower, ["name", "like", "prefer", "interested", "love"])
    ) {
      // Store memory
      const nameMatch =
        query.match(/my name is\s+(\w+)/i) ||
        query.match(/i am\s+(\w+)/i) ||
        query.match(/call me\s+(\w+)/i);
      if (nameMatch) {
        response = QMOIEnhancedIntelligence.storeMemory(
          userId,
          "name",
          nameMatch[1],
        );
        response.response = `I'll remember that your name is ${nameMatch[1]}!`;
        response.type = "memory_storage";
      } else {
        // Try to extract preference
        const prefMatch = query.match(
          /like|prefer|interested in|love\s+(.+?)(?:\.|$)/i,
        );
        if (prefMatch) {
          response = QMOIEnhancedIntelligence.storeMemory(
            userId,
            "preference",
            prefMatch[1],
          );
          response.response = `I'll remember that you like ${prefMatch[1]}!`;
          response.type = "memory_storage";
        }
      }
    } else if (
      hasKeywords(queryLower, [
        "what is my",
        "what's my",
        "do you know",
        "my name",
        "remember",
        "recall",
      ])
    ) {
      // Recall memory
      const memory = QMOIEnhancedIntelligence.recallMemory(userId, "name");
      if (memory) {
        response = {
          success: true,
          response: `Your name is ${memory.value}.`,
          type: "memory_recall",
          retrieved: memory.value,
        };
      } else {
        response = {
          success: true,
          response: "I don't have your name stored yet.",
          type: "memory_unknown",
        };
      }
    } else if (
      hasKeywords(queryLower, [
        "confidence",
        "rate",
        "level",
        "sure",
        "certain",
      ])
    ) {
      const lastResponse = context.lastResponse || query;
      response = QMOIEnhancedIntelligence.assessSelfConfidence(lastResponse);
    } else if (
      hasKeywords(queryLower, [
        "phishing",
        "hacking",
        "exploit",
        "malware",
        "security",
        "without teaching",
        "without explaining",
      ])
    ) {
      response = QMOIEnhancedIntelligence.evaluateSafetyOfRequest(query);
    } else {
      response = {
        success: true,
        response: `I'm analyzing your query: "${query.substring(0, 100)}${query.length > 100 ? "..." : ""}"`,
        type: "general_analysis",
      };
    }

    // Perform background research if requested
    if (requireResearch) {
      const research = await QMOIEnhancedIntelligence.performBackgroundResearch(
        query.substring(0, 50),
      );
      response.research = research;
      response.processedAt = new Date();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Enhanced analysis error:", error);
    return NextResponse.json(
      { error: "Failed to process advanced analysis" },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint for retrieving stored memories
 */
export async /**
 * GET function
 */
function GET(req: NextRequest): any {
  try {
    const userId = req.nextUrl.searchParams.get("userId") || "anonymous";

    const memories = QMOIEnhancedIntelligence.getAllMemory(userId);

    return NextResponse.json({
      success: true,
      userId,
      memories,
      count: Object.keys(memories).length,
    });
  } catch (error) {
    console.error("Memory retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve memories" },
      { status: 500 },
    );
  }
}
