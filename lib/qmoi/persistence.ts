import { promises as fs } from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authService } from "@/lib/auth/service";

const USE_DB = Boolean(process.env.DATABASE_URL);
const QMOI_DATA_DIR = process.env.QMOI_DATA_DIR || path.join(process.cwd(), "data");
const PROFILE_QUESTIONS_FILE = path.join(QMOI_DATA_DIR, "qmoi-profile-question-responses.json");
const AVATAR_SELECTION_FILE = path.join(QMOI_DATA_DIR, "qmoi-avatar-selections.json");

export type QmoiProfileAnswers = Record<string, unknown>;
export type QmoiProfileInsights = {
  summary: string;
  commitmentLevel: string;
  recommendedPath: string;
  learningStyle: string[];
  priorityFocus: string;
};

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(QMOI_DATA_DIR, { recursive: true });
  } catch {
    // ignore failure, fallback persistence may still work if created later
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const contents = await fs.readFile(filePath, "utf-8");
    return JSON.parse(contents) as T;
  } catch {
    await ensureDataDir();
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function normalizeText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
}

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function computeProfileInsights(answers: QmoiProfileAnswers): QmoiProfileInsights {
  const experienceLevel = normalizeText(answers.experience_level).toLowerCase();
  const availability = normalizeText(answers.availability).toLowerCase();
  const skillFocus = normalizeText(answers.skill_focus);
  const careerGoals = normalizeText(answers.career_goals);
  const preferredFormats = normalizeArray(answers.preferred_formats);

  const commitmentLevel = availability.includes("5") || availability.includes("10") || availability.includes("hours")
    ? "medium"
    : availability.includes("flexible") || availability.includes("unlimited")
    ? "high"
    : "low";

  let recommendedPath = "Personalized learning path";
  if (experienceLevel.includes("beginner")) {
    recommendedPath = "Foundational onboarding and beginner-friendly labs";
  } else if (experienceLevel.includes("intermediate")) {
    recommendedPath = "Hands-on skill refinement and applied project guidance";
  } else if (experienceLevel.includes("advanced") || experienceLevel.includes("expert")) {
    recommendedPath = "Expert-level strategy, automation, and leadership enablement";
  }

  const learningStyle = preferredFormats.length > 0 ? preferredFormats : ["interactive", "guided", "self-paced"];
  const priorityFocus = skillFocus || careerGoals || "General improvement";

  const summary = `The profile indicates a ${experienceLevel || "general"} learner focused on ${priorityFocus}. The recommended path emphasizes ${recommendedPath.toLowerCase()}.`;

  return {
    summary,
    commitmentLevel,
    recommendedPath,
    learningStyle,
    priorityFocus,
  };
}

export function getRequestUserId(req: NextRequest, body?: Record<string, unknown>): string | null {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : req.cookies.get("accessToken")?.value;

  if (token) {
    const decoded = authService.decodeToken(token);
    if (decoded && typeof decoded.userId === "string") {
      return decoded.userId;
    }
  }

  if (body?.userId && typeof body.userId === "string" && body.userId.trim()) {
    return body.userId.trim();
  }

  try {
    const url = new URL(req.url);
    const explicitUserId = url.searchParams.get("userId");
    if (explicitUserId) {
      return explicitUserId;
    }
  } catch {
    // ignore invalid URLs
  }

  return null;
}

export async function getProfileQuestionResponse(userId: string): Promise<null | { answers: QmoiProfileAnswers; insights: QmoiProfileInsights; submittedAt: string; updatedAt?: string }> {
  if (USE_DB) {
    try {
      const response = await prisma.profileQuestionResponse.findUnique({
        where: { userId },
      });
      if (!response) return null;
      return {
        answers: response.answers as QmoiProfileAnswers,
        insights: (response.insights ?? {}) as QmoiProfileInsights,
        submittedAt: response.submittedAt.toISOString(),
        updatedAt: response.updatedAt.toISOString(),
      };
    } catch {
      // fallback to local storage if the database or model is not available
    }
  }

  const store = await readJsonFile<Record<string, any>>(PROFILE_QUESTIONS_FILE, {});
  return store[userId] ?? null;
}

export async function saveProfileQuestionResponse(userId: string, answers: QmoiProfileAnswers): Promise<{ answers: QmoiProfileAnswers; insights: QmoiProfileInsights; submittedAt: string; updatedAt: string }> {
  const insights = computeProfileInsights(answers);
  const payload = {
    answers,
    insights,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (USE_DB) {
    try {
      const result = await prisma.profileQuestionResponse.upsert({
        where: { userId },
        create: {
          userId,
          answers,
          insights,
          submittedAt: new Date(),
        },
        update: {
          answers,
          insights,
          submittedAt: new Date(),
        },
      });

      return {
        answers: result.answers as QmoiProfileAnswers,
        insights: (result.insights ?? {}) as QmoiProfileInsights,
        submittedAt: result.submittedAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };
    } catch {
      // fallback to local storage if the model is unavailable or database connection fails
    }
  }

  const store = await readJsonFile<Record<string, any>>(PROFILE_QUESTIONS_FILE, {});
  store[userId] = payload;
  await writeJsonFile(PROFILE_QUESTIONS_FILE, store);
  return payload;
}

export async function getAvatarSelection(userId: string): Promise<string | null> {
  if (USE_DB) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });
      return user?.avatar ?? null;
    } catch {
      // fallback to local storage if DB access fails
    }
  }

  const store = await readJsonFile<Record<string, { avatarId: string }>>(AVATAR_SELECTION_FILE, {});
  return store[userId]?.avatarId ?? null;
}

export async function setAvatarSelection(userId: string, avatarId: string): Promise<boolean> {
  if (USE_DB) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarId },
      });
      return true;
    } catch {
      // fallback to local storage if DB access fails
    }
  }

  const store = await readJsonFile<Record<string, { avatarId: string; updatedAt: string }>>(AVATAR_SELECTION_FILE, {});
  store[userId] = { avatarId, updatedAt: new Date().toISOString() };
  await writeJsonFile(AVATAR_SELECTION_FILE, store);
  return true;
}
