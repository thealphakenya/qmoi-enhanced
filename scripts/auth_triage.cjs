const fs = require("fs");
const path = require("path");
const glob = require("glob");

const headerFiles = glob.sync("app/api/**/route.ts");
const results = [];

for (const file of headerFiles) {
  const content = fs.readFileSync(file, "utf8");
  const hasHeader =
    /headers.get\(|req.headers.get\(|request.headers.get\(/.test(content);
  if (!hasHeader) continue;
  const hasRequire = /requireApiKey\(|libProposals.requireApiKey/.test(content);
  const hasAdminEnv =
    /process\.env\.(ADMIN_TOKEN|QMOI_MASTER_API_KEY|MASTER_TOKEN|QMOI_ADMIN_KEY|QMOI_MASTER_API_KEY|ADMIN_KEY)/.test(
      content,
    );
  results.push({
    file,
    hasHeader,
    hasRequire,
    hasAdminEnv,
    summary: hasRequire
      ? "uses requireApiKey"
      : hasAdminEnv
        ? "uses env-admin-key"
        : "no auth detected",
  });
}

fs.writeFileSync(
  ".qmoi_validation/auth_triage_report.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
);
console.log(
  "Wrote .qmoi_validation/auth_triage_report.json with",
  results.length,
  "items",
);
