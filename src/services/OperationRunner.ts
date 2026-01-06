import { exec } from "child_process";
import { promisify } from "util";
import { isProductionConfirmed } from "../../lib/prodGuard";
const execAsync = promisify(exec);

export async function runShellCommand(command: string, cwd?: string) {
  if (!isProductionConfirmed()) {
    throw new Error(
      "Refusing to run shell command without PRODUCTION_CONFIRMED=true"
    );
  }
  const { stdout, stderr } = await execAsync(command, {
    cwd,
    maxBuffer: 10 * 1024 * 1024,
  });
  return { stdout, stderr };
}

export async function tryRunShellCommand(command: string, cwd?: string) {
  try {
    return await runShellCommand(command, cwd);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: message };
  }
}
