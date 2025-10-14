import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const MEMORY_PATH = path.resolve(process.cwd(), "qmoi_memory.json");

async function logToMemory(message: string, response: string) {
  let memory: any[] = [];
  try {
    const data = await fs.readFile(MEMORY_PATH, "utf-8");
    memory = JSON.parse(data);
  } catch (e) {
    // If file doesn't exist or is empty, start fresh
    memory = [];
  }
  memory.push({ timestamp: new Date().toISOString(), message, response });
  await fs.writeFile(MEMORY_PATH, JSON.stringify(memory, null, 2));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  // Simulate QMOI response (replace with real AI logic if available)
  let response = "";
  if (message.toLowerCase().includes("hello")) {
    response = "Hello! How can I help you today?";
  } else if (message.toLowerCase().includes("how are you")) {
    response = "I'm QMOI, always ready to help!";
  } else {
    response = `You said: ${message}`;
  }
  await logToMemory(message, response);
  return res.status(200).json({ response });
}
