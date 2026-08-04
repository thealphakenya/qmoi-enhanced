/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/jobs/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const jobLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let jobs: unknown[] = [];

    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse job information from logs
      jobs = lines
        .filter((line) => line.includes("job:") || line.includes("Job"))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : "pending",
              stage: "build",
              duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }

    return NextResponse.json({ jobs });
  } catch (_error) {
    (console as any).error("Error fetching jobs:", _error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}
