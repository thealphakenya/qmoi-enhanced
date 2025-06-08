require("dotenv").config(); // Load environment variables from .env

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Starting Force Deployment to GitHub...");

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN not found in environment!");
  process.exit(1);
}
const REPO_URL = `https://${GITHUB_TOKEN}@github.com/thealphakenya/Alpha-Q-ai.git`;

try {
  // Create project structure
  const directories = [
    "app",
    "components",
    "components/ui",
    "components/chat",
    "components/preview",
    "components/ai-features",
    "lib",
    "scripts",
    "public",
    "styles",
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });

  // Initialize git if not already
  try {
    execSync("git status", { stdio: "ignore" });
    console.log("✅ Git already initialized");
  } catch {
    execSync("git init");
    console.log("✅ Git initialized");
  }

  // Configure Git
  execSync('git config user.email "action@github.com"');
  execSync('git config user.name "GitHub Action"');
  console.log("✅ Git configured");

  // Stage all files
  execSync("git add .");
  console.log("✅ Files added");

  // Commit (ignore if nothing to commit)
  try {
    execSync('git commit -m "Complete Alpha-Q AI System with Chat, Preview, and Enhanced Features"');
    console.log("✅ Changes committed");
  } catch (err) {
    console.log("⚠️ No new changes to commit");
  }

  // Set branch to main
  execSync("git branch -M main");
  console.log("✅ Main branch set");

  // Update remote
  try {
    execSync("git remote remove origin");
  } catch {}
  execSync(`git remote add origin ${REPO_URL}`);
  console.log("✅ Remote set");

  // Force push
  execSync("git push -u origin main --force");
  console.log("✅ Successfully pushed to GitHub!");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("🔗 Repository: https://github.com/thealphakenya/Alpha-Q-ai");
} catch (error) {
  console.error("❌ Deployment failed:", error.message);
}
