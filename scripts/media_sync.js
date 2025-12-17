// QMOI Media Sync Script
// Syncs media files from ./public/media to a remote backup (S3)
// Usage: node scripts/media_sync.js

const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const MEDIA_DIR = path.join(__dirname, "../public/media");
const LOG_FILE = path.join(__dirname, "../logs/media_sync.log");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const S3_BUCKET = process.env.S3_BUCKET;

function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
  console.log(message);
}

function syncToRemote(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: fileContent,
  };
  s3.upload(params, function (err, data) {
    if (err) {
      log(`S3 upload failed: ${fileName} - ${err}`);
    } else {
      log(`S3 upload success: ${fileName} -> ${data.Location}`);
    }
  });
}

function syncMedia() {
  if (!fs.existsSync(MEDIA_DIR)) {
    log("Media directory does not exist.");
    return;
  }
  const files = fs.readdirSync(MEDIA_DIR);
  files.forEach((file) => {
    const filePath = path.join(MEDIA_DIR, file);
    if (fs.statSync(filePath).isFile()) {
      syncToRemote(filePath);
    }
  });
  log("Media sync complete.");
}

syncMedia();
