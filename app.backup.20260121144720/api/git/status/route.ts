/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/status/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(_req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to get Git status",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}
