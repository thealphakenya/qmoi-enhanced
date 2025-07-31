import fs from "fs";
import path from "path";
import https from "https";

const FILES = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1",
  "age_gender_model-weights_manifest.json",
  "age_gender_model-shard1",
];

const BASE_URL =
  "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js-models@master/weights";

export async function ensureFaceApiModels(dir = "/models") {
  const local = typeof window === "undefined" ? path.join(process.cwd(), "public", "models") : dir;

  if (!fs.existsSync(local)) fs.mkdirSync(local, { recursive: true });

  for (const file of FILES) {
    const localPath = path.join(local, file);
    if (!fs.existsSync(localPath)) {
      console.log(`⬇️  Downloading ${file}`);
      await downloadFile(`${BASE_URL}/${file}`, localPath);
    }
  }
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) return reject(`Failed: ${url}`);
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.existsSync(dest) && fs.unlinkSync(dest);
        reject(err.message);
      });
  });
}
