import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";
import { Client as SSHClient } from "ssh2";

const DEVICES_FILE = path.resolve(process.cwd(), "data", "devices.json");
function loadDevices() {
  if (!fs.existsSync(DEVICES_FILE)) return [];
  return JSON.parse(fs.readFileSync(DEVICES_FILE, "utf-8"));
}
function saveDevices(devices: any[]) {
  fs.writeFileSync(DEVICES_FILE, JSON.stringify(devices, null, 2));
}

const handler = requireRole(["admin", "master"])(async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { method, body, query } = req;
  let devices = loadDevices();
  if (method === "GET") {
    return res.status(200).json({ items: devices });
  }
  if (method === "POST") {
    const { name, host, port, username, password, privateKey } = body;
    if (!name || !host || !username)
      return res.status(400).json({ error: "Missing fields" });
    const device = {
      id: `dev_${Date.now()}`,
      name,
      host,
      port: port || 22,
      username,
      password,
      privateKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    devices.push(device);
    saveDevices(devices);
    return res.status(201).json({ device });
  }
  if (method === "PUT") {
    const { id, ...update } = body;
    const idx = devices.findIndex((d: any) => d.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    devices[idx] = {
      ...devices[idx],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveDevices(devices);
    return res.status(200).json({ device: devices[idx] });
  }
  if (method === "DELETE") {
    const { id } = body;
    devices = devices.filter((d: any) => d.id !== id);
    saveDevices(devices);
    return res.status(200).json({ success: true });
  }
  if (method === "POST" && query.action === "test") {
    const { id } = body;
    const device = devices.find((d: any) => d.id === id);
    if (!device) return res.status(404).json({ error: "Not found" });
    // Test SSH connection
    const ssh = new SSHClient();
    ssh
      .on("ready", () => {
        ssh.end();
        return res.status(200).json({ success: true });
      })
      .on("error", (err) => {
        return res.status(500).json({ error: err.message });
      })
      .connect({
        host: device.host,
        port: device.port,
        username: device.username,
        password: device.password,
        privateKey: device.privateKey,
      });
    return;
  }
  res.status(405).json({ error: "Method not allowed" });
});

export default handler;
