/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/commit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const { message, files = ["*"] } = (await _req.json()) as any;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { _error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to commit changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}
