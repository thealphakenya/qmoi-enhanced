/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/git/pr/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(_req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await _req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { _error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${
      description || ""
    }" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to create pull _request",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}
