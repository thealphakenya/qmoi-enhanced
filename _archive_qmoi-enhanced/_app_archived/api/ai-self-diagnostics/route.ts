import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);

interface DiagnosticProblem {
  type: string;
  message: string;
  file?: string;
}

interface DiagnosticResponse {
  status: string;
  problems: DiagnosticProblem[];
}

export async function GET(request: NextRequest) {
  const adminToken = request.headers.get("x-admin-token");
  if (adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  if (searchParams.get("problems")) {
    const problems: DiagnosticProblem[] = [];
    try {
      // TypeScript/JS
      const tsc = await new Promise<string>((resolve) =>
        exec("npx tsc --noEmit", (e, out, err) => resolve(out + err)),
      );
      tsc.split("\n").forEach((line) => {
        if (line.includes("error"))
          problems.push({ type: "tsc", message: line });
      });
      // Python
      const pyFiles = fs.readdirSync(".").filter((f) => f.endsWith(".py"));
      for (const file of pyFiles) {
        const flake = await new Promise<string>((resolve) =>
          exec(`flake8 ${file}`, (e, out, err) => resolve(out + err)),
        );
        flake.split("\n").forEach((line) => {
          if (line.trim())
            problems.push({ type: "flake8", file, message: line });
        });
      }
      // JS/TS Lint
      const eslint = await new Promise<string>((resolve) =>
        exec("npx eslint .", (e, out, err) => resolve(out + err)),
      );
      eslint.split("\n").forEach((line) => {
        if (line.includes("error"))
          problems.push({ type: "eslint", message: line });
      });
    } catch (e: unknown) {
      problems.push({
        type: "system",
        message: e instanceof Error ? e.message : String(e),
      });
    }
    const response: DiagnosticResponse = {
      status: "diagnostics-complete",
      problems,
    };
    return NextResponse.json(response);
  }

  return NextResponse.json({ error: "Unknown GET action" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get("x-admin-token");
  if (adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  if (searchParams.get("fix")) {
    const results: any[] = [];
    try {
      // TypeScript/JS
      const eslintFix = await new Promise<string>((resolve) =>
        exec("npx eslint . --fix", (e, out, err) => resolve(out + err)),
      );
      results.push({ type: "eslint", result: eslintFix });
      // Python
      const pyFiles = fs.readdirSync(".").filter((f) => f.endsWith(".py"));
      for (const file of pyFiles) {
        const autopep8 = await new Promise<string>((resolve) =>
          exec(`autopep8 --in-place ${file}`, (e, out, err) =>
            resolve(out + err),
          ),
        );
        results.push({ type: "autopep8", file, result: autopep8 });
      }
      // Install missing npm modules
      const npmInstall = await new Promise<string>((resolve) =>
        exec("npm install", (e, out, err) => resolve(out + err)),
      );
      results.push({ type: "npm", result: npmInstall });
      // Install missing Python modules
      const pipInstall = await new Promise<string>((resolve) =>
        exec("pip install -r requirements.txt", (e, out, err) =>
          resolve(out + err),
        ),
      );
      results.push({ type: "pip", result: pipInstall });
      // Create missing files if referenced in errors
      const problemsRes = await new Promise<string>((resolve) =>
        exec("npx tsc --noEmit", (e, out, err) => resolve(out + err)),
      );
      problemsRes.split("\n").forEach((line) => {
        const match = line.match(/error TS2307: Cannot find module '(.+?)'/);
        if (match) {
          const missingFile = match[1];
          if (!fs.existsSync(missingFile)) {
            fs.writeFileSync(missingFile, "// Auto-created by AI");
            results.push({ type: "file-create", file: missingFile });
          }
        }
      });
    } catch (e: unknown) {
      results.push({
        type: "system",
        message: e instanceof Error ? e.message : String(e),
      });
    }
    return NextResponse.json({ results });
  }

  return NextResponse.json({ error: "Unknown POST action" }, { status: 400 });
}
