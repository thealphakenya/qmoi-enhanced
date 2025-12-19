import { execSync } from "child_process";

describe("CI checks", () => {
  test("production build should not include model selector (fast scan)", () => {
    // Run the check script in fast mode (skip build) to scan source files only
    execSync("node scripts/ci_checks/check_no_model_selector.cjs", {
      env: { ...process.env, SKIP_BUILD: "1" },
      stdio: "inherit",
    });
  }, 30_000);
});
