// scripts/upload-release-assets.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { execSync } = require("child_process");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "thealphakenya";
const REPO = "Alpha-Q-ai";

if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN is missing in environment.");
  process.exit(1);
}

const releaseInfoPath = "release.json";
if (!fs.existsSync(releaseInfoPath)) {
  console.error("❌ Missing release.json");
  process.exit(1);
}
const releaseInfo = JSON.parse(fs.readFileSync(releaseInfoPath));

async function createRelease() {
  const res = await axios.post(
    `https://api.github.com/repos/${OWNER}/${REPO}/releases`,
    {
      tag_name: releaseInfo.version,
      name: releaseInfo.title,
      body: releaseInfo.changelog,
      draft: false,
      prerelease: false,
    },
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );
  return res.data.upload_url.split("{")[0];
}

async function uploadAsset(uploadUrl, filePath) {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath);
  const contentType = "application/octet-stream";

  const uploadRes = await axios.post(
    `${uploadUrl}?name=${encodeURIComponent(fileName)}`,
    content,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": contentType,
        "Content-Length": content.length,
      },
    },
  );
  console.log(`✅ Uploaded: ${fileName}`);
}

(async () => {
  const uploadUrl = await createRelease();
  const files = [];

  const platforms = fs.readdirSync("Qmoi_apps");
  platforms.forEach((platform) => {
    const subDir = `Qmoi_apps/${platform}`;
    if (fs.statSync(subDir).isDirectory()) {
      fs.readdirSync(subDir).forEach((file) => {
        files.push(path.join(subDir, file));
      });
    }
  });

  for (const file of files) {
    await uploadAsset(uploadUrl, file);
  }

  console.log("🚀 All release assets uploaded successfully.");
})();
