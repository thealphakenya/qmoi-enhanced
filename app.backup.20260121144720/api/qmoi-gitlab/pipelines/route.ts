/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/pipelines/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/alpha-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}
