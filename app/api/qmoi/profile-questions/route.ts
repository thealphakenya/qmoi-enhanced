import { NextRequest, NextResponse } from "next/server";
import {
  getProfileQuestionResponse,
  saveProfileQuestionResponse,
  getRequestUserId,
} from "@/lib/qmoi/persistence";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PROFILE_QUESTIONS = [
  {
    id: "career_goals",
    type: "text",
    label: "What are your current career goals?",
    placeholder: "Describe your short- and long-term goals.",
  },
  {
    id: "skill_focus",
    type: "text",
    label: "What skills or domains do you want to improve?",
    placeholder: "e.g. AI, product design, finance, leadership.",
  },
  {
    id: "experience_level",
    type: "select",
    label: "What is your current experience level?",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  {
    id: "availability",
    type: "text",
    label: "How much time can you dedicate weekly?",
    placeholder: "e.g. 5 hours, 10+ hours, flexible.",
  },
  {
    id: "preferred_formats",
    type: "multi-select",
    label: "Which learning or collaboration formats do you prefer?",
    options: ["Text", "Video", "Code", "Interactive exercises", "Mentoring"],
  },
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = getRequestUserId(req) || url.searchParams.get("userId");
  const savedResponse = userId ? await getProfileQuestionResponse(userId) : null;

  return NextResponse.json({
    success: true,
    route: "/api/qmoi/profile-questions",
    method: "GET",
    data: {
      questions: PROFILE_QUESTIONS,
      description: "Answer these profile questions to tailor the QMOI experience.",
      savedResponse,
    },
  });
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON payload",
      },
      { status: 400 },
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      {
        success: false,
        error: "Request body must be an object with userId and answers",
      },
      { status: 400 },
    );
  }

  const body = payload as Record<string, unknown>;
  const userId = getRequestUserId(req, body) || (typeof body.userId === "string" ? body.userId.trim() : null);
  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication or explicit userId is required to persist responses",
      },
      { status: 401 },
    );
  }

  const answers = body.answers;
  if (typeof answers !== "object" || answers === null) {
    return NextResponse.json(
      {
        success: false,
        error: "Answers must be provided as an object keyed by question id",
      },
      { status: 400 },
    );
  }

  const saved = await saveProfileQuestionResponse(userId, answers as Record<string, unknown>);

  return NextResponse.json({
    success: true,
    route: "/api/qmoi/profile-questions",
    method: "POST",
    message: "Profile questions saved successfully",
    data: saved,
  });
}
