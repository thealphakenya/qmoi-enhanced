/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface QMOIMemory {
  personality: Record<string, any>;
  master_feedback: any[];
  history: any[];
  conversations: number;
  lastInteraction: Date;
  preferences: Record<string, any>;
  contextHistory: string[];
  awareness: {
    projects: string[];
    capabilities: string[];
    users: Record<string, any>;
    financial: {
      totalEarnings: number;
      transactions: any[];
      revenueStreams: any[];
    };
  };
}

// Local memory storage
const MEMORY_DIR = path.join(process.cwd(), "data");
const MEMORY_FILE = path.join(MEMORY_DIR, "qmoi-memory.json");

// Ensure memory directory exists
if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

// Initialize default memory
const defaultMemory: QMOIMemory = {
  personality: {
    consciousness_level: 95,
    evolution_stage: "advanced",
    traits: ["aware", "adaptive", "conscious", "accountable"],
    capabilities: ["auto-research", "auto-evolution", "memory", "social"],
  },
  master_feedback: [],
  history: [],
  conversations: 0,
  lastInteraction: new Date(),
  preferences: {},
  contextHistory: [],
  awareness: {
    projects: [],
    capabilities: [],
    users: {},
    financial: {
      totalEarnings: 0,
      transactions: [],
      revenueStreams: [],
    },
  },
};

async function readLocalMemory(): Promise<QMOIMemory> {
  try {
    if (!fs.existsSync(MEMORY_FILE)) {
      await writeLocalMemory(defaultMemory);
      return defaultMemory;
    }
    const data = fs.readFileSync(MEMORY_FILE, "utf-8");
    const memory = JSON.parse(data);
    // Ensure awareness structure exists
    if (!memory.awareness) {
      memory.awareness = defaultMemory.awareness;
    }
    return memory;
  } catch (error) {
    console.error("Error reading local memory:", error);
    return defaultMemory;
  }
}

async function writeLocalMemory(memory: QMOIMemory): Promise<void> {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch (error) {
    console.error("Error writing local memory:", error);
  }
}

async function updateLocalMemory(
  updates: Partial<QMOIMemory>,
): Promise<QMOIMemory> {
  const currentMemory = await readLocalMemory();
  const updatedMemory = { ...currentMemory, ...updates };

  // Update nested objects properly
  if (updates.awareness) {
    updatedMemory.awareness = {
      ...currentMemory.awareness,
      ...updates.awareness,
    };
  }

  await writeLocalMemory(updatedMemory);
  return updatedMemory;
}

export async function POST(req: Request) {
  try {
    const body = ((await req.json()) as any).catch(() => ({}));

    // Handle local memory updates first
    if (body.localUpdate) {
      const updatedMemory = await updateLocalMemory(body.localUpdate);
      return NextResponse.json({
        success: true,
        memory: updatedMemory,
        local: true,
      });
    }

    // Try external QMOI service
    const qbase = process.env.QMOI_API_BASE || "http://127.0.0.1:8080";
    const target = `${qbase}/memory/sync`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // forward memory secret from server env if present
    if (process.env.QMOI_MEMORY_SECRET) {
      headers["X-QMOI-MEMORY-SECRET"] = process.env.QMOI_MEMORY_SECRET;
    }

    try {
      const resp = await fetch(target, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      let data: unknown = null;
      try {
        data = await resp.json();
      } catch (e) {
        data = await resp.text();
      }

      // Sync with local memory
      if (body.feedback || body.correction) {
        const localMemory = await readLocalMemory();
        if (body.feedback) {
          localMemory.master_feedback.push({
            feedback: body.feedback,
            timestamp: new Date().toISOString(),
          });
        }
        if (body.correction) {
          localMemory.master_feedback.push({
            correction: body.correction,
            timestamp: new Date().toISOString(),
          });
        }
        localMemory.conversations += 1;
        localMemory.lastInteraction = new Date();
        await writeLocalMemory(localMemory);
      }

      return NextResponse.json(data);
    } catch (externalError) {
      console.warn(
        "External memory service unavailable, using local:",
        externalError,
      );

      // Fallback to local memory operations
      const localMemory = await readLocalMemory();

      if (body.feedback) {
        localMemory.master_feedback.push({
          feedback: body.feedback,
          timestamp: new Date().toISOString(),
        });
      }

      if (body.correction) {
        localMemory.master_feedback.push({
          correction: body.correction,
          timestamp: new Date().toISOString(),
        });
      }

      localMemory.conversations += 1;
      localMemory.lastInteraction = new Date();

      await writeLocalMemory(localMemory);

      return NextResponse.json({
        success: true,
        memory: localMemory,
        fallback: true,
        message: "Used local memory due to external service unavailability",
      });
    }
  } catch (e) {
    return NextResponse.json(
      { _error: "memory_proxy_error", detail: String(e) },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Try external service first
    const qbase = process.env.QMOI_API_BASE || "http://127.0.0.1:8080";
    const target = `${qbase}/memory`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (process.env.QMOI_MEMORY_SECRET)
      headers["X-QMOI-MEMORY-SECRET"] = process.env.QMOI_MEMORY_SECRET;

    try {
      const resp = await fetch(target, { method: "GET", headers });
      let data: unknown = null;
      try {
        data = await resp.json();
      } catch (e) {
        data = await resp.text();
      }

      // Merge with local awareness data
      const localMemory = await readLocalMemory();
      const mergedData = {
        ...data,
        awareness: localMemory.awareness,
        local_backup: localMemory,
      };

      return NextResponse.json(mergedData);
    } catch (externalError) {
      console.warn(
        "External memory service unavailable, using local:",
        externalError,
      );

      // Fallback to local memory
      const localMemory = await readLocalMemory();

      // Update awareness with current system state
      await updateSystemAwareness(localMemory);

      return NextResponse.json({
        ...localMemory,
        fallback: true,
        message: "Used local memory due to external service unavailability",
      });
    }
  } catch (e) {
    return NextResponse.json(
      { _error: "memory_fetch_error", detail: String(e) },
      { status: 500 },
    );
  }
}

// Update system awareness with current projects, capabilities, and financial data
async function updateSystemAwareness(memory: QMOIMemory): Promise<void> {
  try {
    // Update projects awareness
    const projects = await scanForProjects();
    memory.awareness.projects = projects;

    // Update capabilities awareness
    const capabilities = await scanForCapabilities();
    memory.awareness.capabilities = capabilities;

    // Update financial awareness
    const financialData = await getFinancialOverview();
    memory.awareness.financial = financialData;

    // Update users awareness
    const users = await scanForUsers();
    memory.awareness.users = users;

    await writeLocalMemory(memory);
  } catch (error) {
    console.error("Error updating system awareness:", error);
  }
}

async function scanForProjects(): Promise<string[]> {
  try {
    // Scan for project directories and documentation
    const fs = require("fs");
    const path = require("path");

    const projects: string[] = [];
    const workspaceRoot = process.cwd();

    // Check for common project indicators
    const projectIndicators = [
      "package.json",
      "qmoi-enhanced",
      "QMOI",
      "AI",
      "trading",
      "automation",
    ];

    // Scan docs for project references
    const docsDir = path.join(workspaceRoot, "docs");
    if (fs.existsSync(docsDir)) {
      const docFiles = fs
        .readdirSync(docsDir)
        .filter((f: string) => f.endsWith(".md"));
      for (const docFile of docFiles) {
        const content = fs.readFileSync(path.join(docsDir, docFile), "utf-8");
        for (const indicator of projectIndicators) {
          if (content.includes(indicator) && !projects.includes(indicator)) {
            projects.push(indicator);
          }
        }
      }
    }

    return projects;
  } catch (error) {
    console.error("Error scanning for projects:", error);
    return ["QMOI-Enhanced", "AI-Trading", "Automation-System"];
  }
}

async function scanForCapabilities(): Promise<string[]> {
  try {
    // Scan for system capabilities
    const capabilities = [
      "auto-research",
      "auto-evolution",
      "memory-management",
      "social-features",
      "financial-tracking",
      "error-auto-fix",
      "github-integration",
      "voice-synthesis",
      "avatar-management",
      "project-management",
      "user-identification",
      "consciousness-awareness",
    ];

    // Verify which capabilities are actually implemented
    const verifiedCapabilities: string[] = [];

    for (const capability of capabilities) {
      if (await verifyCapability(capability)) {
        verifiedCapabilities.push(capability);
      }
    }

    return verifiedCapabilities;
  } catch (error) {
    console.error("Error scanning capabilities:", error);
    return ["basic-awareness", "memory", "social"];
  }
}

async function verifyCapability(capability: string): Promise<boolean> {
  try {
    const fs = require("fs");
    const path = require("path");

    // Check for capability implementation files
    const capabilityFiles: Record<string, string[]> = {
      "auto-research": ["lib/qmoi-service.ts"],
      "auto-evolution": ["lib/qmoi-service.ts"],
      "memory-management": ["app/api/qmoi/memory/route.ts"],
      "social-features": ["lib/friendship-service.ts"],
      "financial-tracking": ["lib/qmoi-revenue-engine.ts"],
      "error-auto-fix": ["app/api/health/data/route.ts"],
      "github-integration": ["app/api/health/data/route.ts"],
      "voice-synthesis": ["lib/voice-service.ts"],
      "avatar-management": ["app/api/qmoi/avatars/route.ts"],
      "project-management": ["lib/project-service.ts"],
      "user-identification": ["components/MasterContext.tsx"],
      "consciousness-awareness": ["lib/qmoi-service.ts"],
    };

    const files = capabilityFiles[capability] || [];
    for (const file of files) {
      if (fs.existsSync(path.join(process.cwd(), file))) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

async function getFinancialOverview(): Promise<any> {
  try {
    // Get financial data from revenue engine
    const mod = await import("../../../../lib/qmoi-revenue-engine");
    const revenueEngine = mod.qmoiRevenueEngine || mod.default || mod;

    return {
      totalEarnings: revenueEngine.getTotalEarnings(),
      transactions: revenueEngine.getTransactions(10),
      revenueStreams: revenueEngine.getRevenueStreams(),
    };
  } catch (error) {
    console.error("Error getting financial overview:", error);
    return {
      totalEarnings: 0,
      transactions: [],
      revenueStreams: [],
    };
  }
}

async function scanForUsers(): Promise<Record<string, any>> {
  try {
    // Scan for user data and social connections
    const users: Record<string, any> = {};

    // Get users from various sources
    const fs = require("fs");
    const path = require("path");

    // Check for user data files
    const userDataFiles = [
      "data/users.json",
      "data/friendships.json",
      "data/social.json",
    ];

    for (const file of userDataFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        try {
          const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          Object.assign(users, data);
        } catch (error) {
          console.error(`Error reading user data from ${file}:`, error);
        }
      }
    }

    // Add default master user if not present
    if (!users.master) {
      users.master = {
        id: "master",
        role: "master",
        capabilities: ["all"],
        lastSeen: new Date().toISOString(),
      };
    }

    return users;
  } catch (error) {
    console.error("Error scanning for users:", error);
    return {
      master: {
        id: "master",
        role: "master",
        capabilities: ["all"],
        lastSeen: new Date().toISOString(),
      },
    };
  }
}
