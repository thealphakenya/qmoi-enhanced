import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import { isProductionConfirmed } from "../../../../lib/prodGuard";

const execAsync = promisify(exec);

const InstallSchema = z.object({
  repoUrl: z.string().url(),
  branch: z.string().optional(),
  installCmd: z.string().optional(),
  buildCmd: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl, branch, installCmd, buildCmd } = InstallSchema.parse(body);

    if (!isProductionConfirmed()) {
      return NextResponse.json(
        {
          success: false,
          _error: "Requires PRODUCTION_CONFIRMED=true to install extensions",
        },
        { status: 403 }
      );
    }

    const installDir = process.env.EXTENSION_INSTALL_DIR;
    if (!installDir) {
      return NextResponse.json(
        {
          success: false,
          _error: "EXTENSION_INSTALL_DIR env var not configured",
        },
        { status: 500 }
      );
    }

    // Derive a simple dir name from repo url
    const name =
      repoUrl
        .split("/")
        .pop()
        ?.replace(/\.git$/, "") || `ext-${Date.now()}`;
    const target = `${installDir}/${name}`;

    // Ensure git is available
    try {
      await execAsync("git --version");
    } catch (e) {
      return NextResponse.json(
        { success: false, _error: "git is not available on this host" },
        { status: 500 }
      );
    }

    // Clone (shallow)
    await execAsync(`git clone --depth=1 ${repoUrl} ${target}`);

    if (branch) {
      await execAsync(
        `git -C ${target} fetch origin ${branch} --depth=1 && git -C ${target} checkout ${branch}`
      );
    }

    // Run install command if provided
    if (installCmd) {
      await execAsync(installCmd, { cwd: target });
    }

    // Run build command if provided
    if (buildCmd) {
      await execAsync(buildCmd, { cwd: target });
    }

    return NextResponse.json({ success: true, installed: { name, target } });
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, _error: "Installation failed", details },
      { status: 500 }
    );
  }
}
