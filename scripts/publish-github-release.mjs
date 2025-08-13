#!/usr/bin/env node
/**
 * scripts/publish-github-release.mjs
 *
 * End-to-end GitHub release automation:
 * ✅ Finds artifacts in QMOI_release/**
 * ✅ Creates/updates tag
 * ✅ Auto-generates release notes (CHANGELOG or git log)
 * ✅ Updates README badge with latest version
 * ✅ Supports --draft and --prerelease flags
 * ✅ Preferred: GitHub CLI (gh), fallback: GitHub REST API with GITHUB_TOKEN
 *
 * Requirements:
 * - Node 18+ (global fetch)
 * - If using API fallback: env.GITHUB_TOKEN must be set with repo scope
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import os from "os";
import process from "process";

// ---------- CLI Flags ----------
const draft = process.argv.includes("--draft");
const prerelease = process.argv.includes("--prerelease");

// ---------- Utils ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const log = (...a) => console.log("[publish]", ...a);
const warn = (...a) => console.warn("[publish:warn]", ...a);
const err = (...a) => console.error("[publish:error]", ...a);

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8", ...opts }).trim();
}

function safeRun(cmd, opts = {}) {
  try { return run(cmd, opts); } catch { return null; }
}

function ghAvailable() {
  return !!safeRun("gh --version");
}

function ghAuthenticated() {
  return !!safeRun("gh auth status");
}

function requireFile(p) {
  if (!fs.existsSync(p)) throw new Error(`Required file not found: ${p}`);
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeTemp(content, prefix = "release-notes-") {
  const tmpPath = path.join(os.tmpdir(), `${prefix}${Date.now()}.md`);
  fs.writeFileSync(tmpPath, content, "utf8");
  return tmpPath;
}

function findOwnerRepo() {
  const envRepo = process.env.GITHUB_REPOSITORY;
  if (envRepo?.includes("/")) return { owner: envRepo.split("/")[0], repo: envRepo.split("/")[1] };

  const remoteUrl = safeRun("git remote get-url origin");
  if (!remoteUrl) throw new Error("Cannot determine git remote origin");

  const match = remoteUrl.match(/github\.com[/:](.+?)\/(.+?)(\.git)?$/i);
  if (!match) throw new Error(`Cannot parse owner/repo from ${remoteUrl}`);
  return { owner: match[1], repo: match[2] };
}

function lastTag() {
  return safeRun("git describe --tags --abbrev=0 2> NUL || git describe --tags --abbrev=0", { shell: true }) || null;
}

function tagExists(tag) {
  return !!safeRun(`git rev-parse -q --verify refs/tags/${tag}`);
}

function createAndPushTag(tag, message) {
  log(`Creating tag ${tag}`);
  run(`git tag -a ${tag} -m "${message.replace(/"/g, '\\"')}"`);
  const currentBranch = safeRun("git rev-parse --abbrev-ref HEAD") || "main";
  safeRun(`git push origin ${currentBranch}`);
  run(`git push origin ${tag}`);
}

function collectArtifacts(outDir = "QMOI_release") {
  if (!fs.existsSync(outDir)) return [];
  const wanted = [];
  const exts = new Set([".exe", ".zip", ".7z", ".dmg", ".pkg", ".tar", ".gz", ".AppImage", ".deb", ".rpm", ".snap", ".msi"]);
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (exts.has(path.extname(full)) || stat.size > 512 * 1024) wanted.push(full);
    }
  })(outDir);
  return wanted;
}

function notesFromChangelog(version) {
  const changelog = path.join(process.cwd(), "CHANGELOG.md");
  if (!fs.existsSync(changelog)) return null;
  const raw = fs.readFileSync(changelog, "utf8");
  const tag = `v${version}`;
  const re = new RegExp(`(^|\\n)##\\s*${tag}\\b[\\s\\S]*?(?=\\n##\\s|\\n#\\s|$)`, "i");
  const m = raw.match(re);
  return m ? m[0].replace(/^.*?\n/, "").trim() : null;
}

function notesFromGit(tagFrom, tagTo = "HEAD") {
  const range = tagFrom ? `${tagFrom}..${tagTo}` : "";
  const out = safeRun(`git log ${range} --pretty=format:"* %s"`, { shell: true }) || "";
  return out.trim() || "* Initial release";
}

function updateChangelog(version) {
  const changelog = path.join(process.cwd(), "CHANGELOG.md");
  const date = new Date().toISOString().split("T")[0];
  let content;
  if (fs.existsSync(changelog)) {
    content = fs.readFileSync(changelog, "utf8");
    if (!content.includes(`## v${version}`)) {
      const newSection = `\n## v${version} (${date})\n\n- Auto-generated changelog\n`;
      content = newSection + content;
      fs.writeFileSync(changelog, content);
    }
  } else {
    content = `# Changelog\n\n## v${version} (${date})\n\n- Initial release\n`;
    fs.writeFileSync(changelog, content);
  }
}

function updateReadmeBadge(version) {
  const readme = path.join(process.cwd(), "README.md");
  if (!fs.existsSync(readme)) return;
  let content = fs.readFileSync(readme, "utf8");
  content = content.replace(/(Version:\s*)(v?\d+\.\d+\.\d+)/, `$1v${version}`);
  fs.writeFileSync(readme, content);
}

// ---------- Main ----------
(async () => {
  try {
    requireFile("package.json");
    const pkg = readJSON("package.json");
    const version = pkg.version;
    const tag = `v${version}`;

    const { owner, repo } = findOwnerRepo();
    log(`Repo: ${owner}/${repo}  Tag: ${tag}`);

    updateChangelog(version);
    updateReadmeBadge(version);

    if (!tagExists(tag)) createAndPushTag(tag, `chore(release): ${tag}`);

    const artifacts = collectArtifacts();
    log(`Found ${artifacts.length} artifact(s).`);

    let body = notesFromChangelog(version) || notesFromGit(lastTag(), "HEAD");
    body = `# Release ${tag}\n\n${body}`;

    if (ghAvailable() && ghAuthenticated()) {
      const notesFile = writeTemp(body);
      try {
        const args = [
          "release", "create", tag,
          ...artifacts,
          `--title "QMOI AI ${tag}"`,
          `--notes-file "${notesFile}"`,
          draft ? "--draft" : "",
          prerelease ? "--prerelease" : "",
          `--repo "${owner}/${repo}"`
        ].join(" ");
        try {
          run(`gh ${args}`);
        } catch {
          run(`gh release edit ${tag} --notes-file "${notesFile}"`);
        }
      } finally {}
      log("✅ Release completed via GitHub CLI.");
      return;
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is required for API fallback.");
    const apiBase = "https://api.github.com";
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "qmoi-release-script"
    };

    let release;
    const existing = await fetch(`${apiBase}/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`, { headers });
    if (existing.status === 200) {
      release = await existing.json();
    } else {
      const createRes = await fetch(`${apiBase}/repos/${owner}/${repo}/releases`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tag_name: tag,
          name: `QMOI AI ${tag}`,
          body,
          draft,
          prerelease
        })
      });
      if (!createRes.ok) throw new Error(`Failed to create release: ${await createRes.text()}`);
      release = await createRes.json();
    }

    for (const file of artifacts) {
      const name = path.basename(file);
      const data = fs.readFileSync(file);
      const uploadUrl = `https://uploads.github.com/repos/${owner}/${repo}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`;
      const upRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/octet-stream" },
        body: data
      });
      if (!upRes.ok) throw new Error(`Upload failed for ${name}: ${await upRes.text()}`);
    }
    log("✅ Release completed via API.");
  } catch (e) {
    err(e.message || e);
    process.exit(1);
  }
})();
