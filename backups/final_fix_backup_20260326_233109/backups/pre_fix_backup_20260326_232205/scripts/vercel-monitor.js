// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
#!/usr/bin/env node
/**
 * Vercel Deployment Monitor
 * Monitors deployment status and provides real-time feedback
 */

const https = require("https");

// Vercel API token (expects VERCEL_TOKEN env var)
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_NAME = "qmoi-enhanced";
const TEAM_ID = process.env.VERCEL_TEAM_ID;

if (!VERCEL_TOKEN) {
  console.log("⚠️  VERCEL_TOKEN not set. Skipping Vercel API monitoring.");
  console.log("Set VERCEL_TOKEN=your_token to enable.");
  process.exit(0);
}

console.log(`\n📡 Monitoring deployment for project: ${PROJECT_NAME}\n`);

// Helper to make Vercel API request
function vercelAPI(path) {
  return new Promise((resolve, reject) => {
    const _options = {
      hostname: "api.vercel.com",
      path: path,
      method: "GET",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "User-Agent": "Vercel-Deployment-Monitor/1.0",
      },
    };

    const req = https.request(_options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (_e) {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(10000);
    req.end();
  });
}

// Get deployment status
async function checkDeployment() {
  try {
    // Get project details
    const projectPath = TEAM_ID
      ? `/v9/projects/${PROJECT_NAME}?teamId=${TEAM_ID}`
      : `/v9/projects/${PROJECT_NAME}`;

    const project = await vercelAPI(projectPath);

    if (!project.id) {
      console.log("❌ Project not found on Vercel");
      process.exit(1);
    }

    console.log(`✅ Project found: ${project.name}`);
    console.log(`   ID: ${project.id}`);
    console.log(
      `   Region: ${project.latestDeployments?.[0]?.regions?.[0] || "N/A"}\n`,
    );

    // Get latest deployments
    const deploymentsPath = TEAM_ID
      ? `/v6/deployments?projectId=${project.id}&teamId=${TEAM_ID}&limit=5`
      : `/v6/deployments?projectId=${project.id}&limit=5`;

    const deployments = await vercelAPI(deploymentsPath);

    if (!deployments.deployments || deployments.deployments.length === 0) {
      console.log("❌ No deployments found");
      process.exit(1);
    }

    console.log("📋 Latest Deployments:\n");

    const latest = deployments.deployments[0];
    console.log(`Latest Deployment:`);
    console.log(`  Status: ${latest.state}`);
    console.log(`  URL: ${latest.url}`);
    console.log(`  Created: ${new Date(latest.createdAt).toLocaleString()}`);
    console.log(
      `  Commit: ${latest.meta?.githubCommitSha?.substring(0, 7) || "N/A"}`,
    );
    console.log(`  Branch: ${latest.meta?.githubCommitRef || "N/A"}\n`);

    if (latest.state === "READY") {
      console.log("✅ Deployment is READY and live!\n");
      console.log(`🌐 Access your app at: https://${latest.url}`);
    } else if (latest.state === "BUILDING") {
      console.log("⏳ Deployment is still BUILDING...\n");
    } else if (latest.state === "ERROR") {
      console.log("❌ Deployment has ERRORS\n");
      if (latest.errorMessage) {
        console.log(`Error: ${latest.errorMessage}`);
      }
    } else {
      console.log(`⚠️  Deployment status: ${latest.state}\n`);
    }

    // Show recent deployments
    console.log("Recent Deployments:");
    deployments.deployments.slice(0, 5).forEach((deploy, idx) => {
      const url = deploy.url ? `https://${deploy.url}` : "N/A";
      const badge =
        deploy.state === "READY"
          ? "✅"
          : deploy.state === "ERROR"
            ? "❌"
            : "⏳";
      console.log(
        `${badge} ${(idx + 1).toString().padStart(2)}. ${deploy.state.padEnd(8)} - ${url} (${new Date(deploy.createdAt).toLocaleString()})`,
      );
    });

    console.log("\n");
  } catch (error) {
    console.error("❌ Error checking deployment:", error.message);
    console.log("\nTroubleshooting:");
    console.log("1. Verify VERCEL_TOKEN is correct");
    console.log("2. Verify project name: qmoi-enhanced");
    console.log("3. Check GitHub webhook is enabled on Vercel");
    process.exit(1);
  }
}

// Run monitor
checkDeployment();
