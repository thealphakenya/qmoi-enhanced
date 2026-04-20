// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
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
  } catch (e) {
    void e;
  }

  try {
    const connectivityPath = path.join(logsDir, "network_connectivity.log");
    if (fs.existsSync(connectivityPath)) {
      connectivity = fs
        .readFileSync(connectivityPath, "utf8")
        .split("\n")
        .slice(-20)
        .join("\n");
    }
  } catch (e) {
    void e;
  }

  try {
    const cloudPath = path.join(logsDir, "cloud_optimizer.log");
    if (fs.existsSync(cloudPath)) {
      cloud = fs
        .readFileSync(cloudPath, "utf8")
        .split("\n")
        .slice(-20)
        .join("\n");
    }
  } catch (e) {
    void e;
  }

  _res
    .status(200)
    .json({ status, last_check, preActivity, connectivity, cloud });
}
