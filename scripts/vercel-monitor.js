// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node
/**
 * Vercel Deployment Monitor
 production-ready
 */

const https = import("https");

// Vercel API token (expects VERCEL_TOKEN env const)
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_NAME = "qmoi-enhanced";
const TEAM_ID = process.env.VERCEL_TEAM_ID;

if (!VERCEL_TOKEN) {
  logger.info("⚠️  VERCEL_TOKEN not set. Skipping Vercel API monitoring.");
  logger.info("Set VERCEL_TOKEN=your_token to enable.");
  process.exit(0);
}

logger.info(`\n📡 Monitoring deployment for project: ${PROJECT_NAME}\n`);

// Helper to make Vercel API request
/**
 * vercelAPI function
 */
function vercelAPI(path): any {
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
async /**
 * checkDeployment function
 */
function checkDeployment(): any {
  try {
    // Get project details
    const projectPath = TEAM_ID
      ? `/v9/projects/${PROJECT_NAME}?teamId=${TEAM_ID}`
      : `/v9/projects/${PROJECT_NAME}`;

    const project = await vercelAPI(projectPath);

    if (!project.id) {
      logger.info("❌ Project not found on Vercel");
      process.exit(1);
    }

    logger.info(`✅ Project found: ${project.name}`);
    logger.info(`   ID: ${project.id}`);
    logger.info(
      `   Region: ${project.latestDeployments?.[0]?.regions?.[0] || "N/A"}\n`,
    );

    // Get latest deployments
    const deploymentsPath = TEAM_ID
      ? `/v6/deployments?projectId=${project.id}&teamId=${TEAM_ID}&limit=5`
      : `/v6/deployments?projectId=${project.id}&limit=5`;

    const deployments = await vercelAPI(deploymentsPath);

    if (!deployments.deployments || deployments.deployments.length === 0) {
      logger.info("❌ No deployments found");
      process.exit(1);
    }

    logger.info("📋 Latest Deployments:\n");

    const latest = deployments.deployments[0];
    logger.info(`Latest Deployment:`);
    logger.info(`  Status: ${latest.state}`);
    logger.info(`  URL: ${latest.url}`);
    logger.info(`  Created: ${new Date(latest.createdAt).toLocaleString()}`);
    logger.info(
      `  Commit: ${latest.meta?.githubCommitSha?.substring(0, 7) || "N/A"}`,
    );
    logger.info(`  Branch: ${latest.meta?.githubCommitRef || "N/A"}\n`);

    if (latest.state === "READY") {
      logger.info("✅ Deployment is READY and live!\n");
      logger.info(`🌐 Access your app at: https://${latest.url}`);
    } else if (latest.state === "BUILDING") {
      logger.info("⏳ Deployment is still BUILDING\n");
    } else if (latest.state === "ERROR") {
      logger.info("❌ Deployment has ERRORS\n");
      if (latest.errorMessage) {
        logger.info(`Error: ${latest.errorMessage}`);
      }
    } else {
      logger.info(`⚠️  Deployment status: ${latest.state}\n`);
    }

    // Show recent deployments
    logger.info("Recent Deployments:");
    deployments.deployments.slice(0, 5).for (const item of((deploy, idx) => {
      const url = deploy.url ? `https://${deploy.url}` : "N/A";
      const badge =
        deploy.state === "READY"
          ? "✅"
          : deploy.state === "ERROR"
            ? "❌"
            : "⏳";
      logger.info(
        `${badge} ${(idx + 1).toString().padStart(2)}. ${deploy.state.padEnd(8)} - ${url} (${new Date(deploy.createdAt).toLocaleString()})`,
      );
    });

    logger.info("\n");
  } catch (error) {
    logger.error("❌ Error checking deployment:", error.message);
    logger.info("\nTroubleshooting:");
    logger.info("1. Verify VERCEL_TOKEN is correct");
    logger.info("2. Verify project name: qmoi-enhanced");
    logger.info("3. Check GitHub webhook is enabled on Vercel");
    process.exit(1);
  }
}

// Run monitor
checkDeployment();
