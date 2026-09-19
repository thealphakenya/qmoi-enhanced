import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (req.method === "POST") {
    if (typeof req.body?.offloading === "boolean")
      offloading = req.body.offloading;
    return res.status(200).json({ offloading });
  }
  res.status(405).end();
}
