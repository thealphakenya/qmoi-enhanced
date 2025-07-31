// scripts/download-face-api-models.ts
import fs from "fs";
import path from "path";
import https from "https";

const MODEL_DIR = path.join(__dirname, "../public/models");
const MODELS = [
  "tiny_face_detector",
  "face_landmark_68",
  "face_recognition",
  "face_expression"
  // "age_gender" // <- disabled due to 404
];

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          return reject(`HTTP ${res.statusCode}`);
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(err.message);
      });
  });
}

async function downloadModels() {
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }

  for (const model of MODELS) {
    const manifest = `${model}_model-weights_manifest.json`;
    const manifestUrl = `https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/${model}/${manifest}`;
    const manifestDest = path.join(MODEL_DIR, manifest);

    let manifestData: any;

    try {
      if (fs.existsSync(manifestDest)) {
        try {
          const content = fs.readFileSync(manifestDest, "utf8");
          manifestData = JSON.parse(content);
          if (!manifestData.weightsManifest?.[0]?.paths) {
            throw new Error("Invalid manifest structure");
          }
        } catch (err: unknown) {
          console.warn(`⚠️ Corrupt manifest detected: ${manifest}. Redownloading... (${(err as Error).message})`);
          fs.unlinkSync(manifestDest);
        }
      }

      if (!fs.existsSync(manifestDest)) {
        console.log(`⬇️ Downloading ${manifest}...`);
        await downloadFile(manifestUrl, manifestDest);
        console.log(`✅ Saved ${manifest}`);
        const content = fs.readFileSync(manifestDest, "utf8");
        manifestData = JSON.parse(content);
      }
    } catch (err: unknown) {
      console.error(`❌ Failed to download ${manifest}: ${(err as Error).message}`);
      continue;
    }

    const shards = manifestData?.weightsManifest?.[0]?.paths || [];
    for (const shardName of shards) {
      const shardUrl = `https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/${model}/${shardName}`;
      const shardDest = path.join(MODEL_DIR, shardName);

      if (!fs.existsSync(shardDest)) {
        console.log(`⬇️ Downloading ${shardName}...`);
        try {
          await downloadFile(shardUrl, shardDest);
          console.log(`✅ Saved ${shardName}`);
        } catch (err: unknown) {
          console.error(`❌ Failed to download ${shardName}: ${(err as Error).message}`);
        }
      } else {
        console.log(`✔️ Already have ${shardName}`);
      }
    }
  }

  console.log("✅ All reachable models checked/downloaded.");
}

downloadModels().catch((err: unknown) => {
  console.error("Unexpected error:", (err as Error).message);
  process.exit(1);
});
