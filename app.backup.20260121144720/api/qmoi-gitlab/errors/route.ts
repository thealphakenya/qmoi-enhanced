/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi-gitlab/errors/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (_error) {
    (console as any).error("Error fetching error statistics:", _error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}
