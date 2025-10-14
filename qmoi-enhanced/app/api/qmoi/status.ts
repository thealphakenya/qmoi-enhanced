import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const logsDir = path.join(process.cwd(), "logs");
  let preActivity = null,
    connectivity = null,
    cloud = null;
  let status = "unknown",
    last_check = new Date().toISOString();

  try {
    const preActivityPath = path.join(logsDir, "pre-activity-check.json");
    if (fs.existsSync(preActivityPath)) {
      preActivity = JSON.parse(fs.readFileSync(preActivityPath, "utf8"));
      status =
        preActivity.summary?.testSuccess === preActivity.summary?.totalTests
          ? "healthy"
          : "issues";
      last_check = preActivity.timestamp || last_check;
    }
  } catch {}

  try {
    const connectivityPath = path.join(logsDir, "network_connectivity.log");
    if (fs.existsSync(connectivityPath)) {
      connectivity = fs
        .readFileSync(connectivityPath, "utf8")
        .split("\n")
        .slice(-20)
        .join("\n");
    }
  } catch {}

  try {
    const cloudPath = path.join(logsDir, "cloud_optimizer.log");
    if (fs.existsSync(cloudPath)) {
      cloud = fs
        .readFileSync(cloudPath, "utf8")
        .split("\n")
        .slice(-20)
        .join("\n");
    }
  } catch {}

  res
    .status(200)
    .json({ status, last_check, preActivity, connectivity, cloud });
}
