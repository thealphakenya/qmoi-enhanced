import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const nodeModulesPath = path.resolve("node_modules");
const lockFilePath = path.resolve("package-lock.json");

function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    console.log(`Deleting folder: ${folderPath}`);
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`Deleting file: ${filePath}`);
    fs.unlinkSync(filePath);
  }
}

function runNpmInstall() {
  console.log("Running npm install...");
  execSync("npm install", { stdio: "inherit" });
}

async function main() {
  try {
    // You can customize the condition here,
    // for example check if node_modules is corrupted or package-lock.json outdated

    // For demo, we just delete always and reinstall
    deleteFolder(nodeModulesPath);
    deleteFile(lockFilePath);

    runNpmInstall();
    console.log("Cleanup and reinstall complete.");
  } catch (err) {
    console.error("Error during clean-install:", err);
    process.exit(1);
  }
}

main();
