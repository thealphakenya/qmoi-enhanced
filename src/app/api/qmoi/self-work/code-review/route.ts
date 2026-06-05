import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { log } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WORKSPACE_ROOT = process.cwd();

function normalizeFilePath(filePath: string): string {
  const normalized = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return path.resolve(WORKSPACE_ROOT, normalized);
}

function pathIsInsideWorkspace(resolvedPath: string): boolean {
  return resolvedPath.startsWith(WORKSPACE_ROOT);
}

function analyzeSourceCode(content: string) {
  const lines = content.split(/\r?\n/);
  const issues: Array<Record<string, unknown>> = [];
  let longLineCount = 0;
  let anyCount = 0;
  let todoCount = 0;
  let consoleUsageCount = 0;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (line.length > 120) {
      longLineCount += 1;
      issues.push({
        type: 'long-line',
        severity: 'warning',
        line: lineNumber,
        message: 'Line exceeds 120 characters',
      });
    }

    if (/\b(any|unknown)\b/.test(line)) {
      anyCount += 1;
      issues.push({
        type: 'typesafety',
        severity: 'warning',
        line: lineNumber,
        message: "Avoid using 'any' or 'unknown' in production code",
      });
    }

    if (/\b(TODO|FIXME|HACK)\b/.test(line)) {
      todoCount += 1;
      issues.push({
        type: 'todo',
        severity: 'info',
        line: lineNumber,
        message: 'Review placeholder comments and complete implementation',
      });
    }

    if (/console\.(log|warn|error|info)\(/.test(line)) {
      consoleUsageCount += 1;
      issues.push({
        type: 'console-logging',
        severity: 'info',
        line: lineNumber,
        message: 'Replace console logging with structured logging for production',
      });
    }
  });

  const score = Math.max(50, 100 - issues.length * 3 - Math.floor(longLineCount / 2));

  return {
    score,
    issues,
    metrics: {
      lineCount: lines.length,
      longLineCount,
      anyCount,
      todoCount,
      consoleUsageCount,
    },
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { filePath } = body;

    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json({ error: 'filePath is required' }, { status: 400 });
    }

    const resolvedPath = normalizeFilePath(filePath);
    if (!pathIsInsideWorkspace(resolvedPath)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    const fileContent = await fs.readFile(resolvedPath, 'utf8').catch(() => null);
    if (!fileContent) {
      return NextResponse.json({ error: 'File not found or unreadable' }, { status: 404 });
    }

    const analysis = analyzeSourceCode(fileContent);
    const summary = `Code review complete. Found ${analysis.issues.length} issue(s), ${analysis.metrics.anyCount} type-safety warning(s), ${analysis.metrics.longLineCount} long line(s), and ${analysis.metrics.todoCount} placeholder marker(s).`;

    return NextResponse.json(
      {
        filePath,
        timestamp: new Date().toISOString(),
        score: analysis.score,
        issuesFound: analysis.issues.length,
        issues: analysis.issues.slice(0, 20),
        metrics: analysis.metrics,
        summary,
        recommendations: [
          'Remove or replace debug logging with structured logger calls.',
          'Split long lines into smaller helper functions.',
          'Avoid any/unknown and add explicit types where possible.',
          'Resolve TODO/FIXME markers before release.',
        ],
        autoFixable: Math.max(0, Math.min(5, analysis.issues.length)),
        manualReviewNeeded: Math.max(0, Math.floor(analysis.issues.length / 4)),
      },
      { status: 200 },
    );
  } catch (error) {
    log.error('Code review error', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 },
    );
  }
}
