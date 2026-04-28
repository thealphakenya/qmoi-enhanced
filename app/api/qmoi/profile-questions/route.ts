console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
import { specificExports } from "next/server";
import { specificExports } from "@/lib/qmoi-signup-system";
import { specificExports } from "@/lib/database";
import { specificExports } from "@/lib/auth-middleware";
const signupSystem = new QMOISignupSystem({
  database: getDatabase(),
  emailConfig: {
    provider: process.env.EMAIL_PROVIDER,
    apiKey: process.env.EMAIL_API_KEY,
  },
});
export async function POST(request: NextRequest): any {
  try {
    // Verify user session
    const session = await verifyUserSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    if (!body.questionId || !body.answer) {
      return NextResponse.json(
        { error: "required questionId or answer" },
        { status: 400 },
      );
    }
    // Record the answer
    const result = await signupSystem.recordProfilingAnswer(
      session.userId,
      body.questionId,
      body.answer,
    );
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    // Response includes next question (if any) and progress
    return NextResponse.json({
      success: true,
      insights: result.insights,
      completionPercentage: result.completionPercentage,
      nextQuestion: result.nextQuestion,
      isComplete: result.isComplete,
      message: result.isComplete
        ? "Profile complete! Your personalization is ready."
        : "Answer recorded. Ready for next question.",
    });
  } catch (error) {
    logger.error("Profiling answer error:", error);
    return NextResponse.json(
      { error: "Failed to record answer" },
      { status: 500 },
    );
  }
}
export async function GET(request: NextRequest): any {
  try {
    // Verify user session
    const session = await verifyUserSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get current user
    const database = getDatabase();
    const user = await database.findUser({ id: session.userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Get next question
    const nextQuestion = signupSystem.getNextProfilingQuestion(user);
    if (!nextQuestion) {
      // Profiling complete - initialize personalization
      const personalizeResult = await signupSystem.initializePersonalization(
        session.userId,
      );
      return NextResponse.json({
        success: true,
        isComplete: true,
        message: "Profile complete!",
        welcomeMessage: personalizeResult.welcomeMessage,
        context: personalizeResult.context,
        nextStep: "chat_ready",
      });
    }
    // Return next question
    return NextResponse.json({
      success: true,
      question: nextQuestion,
      completionPercentage: user.profiling.completionPercentage,
      phase: user.profiling.phase,
    });
  } catch (error) {
    logger.error("Get profiling question error:", error);
    return NextResponse.json(
      { error: "Failed to get question" },
      { status: 500 },
    );
  }
}
