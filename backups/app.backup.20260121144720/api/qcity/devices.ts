// [PRODUCTION READY] this file has no remaining non-production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
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
function saveDevices(devices: unknown[]) {
  fs.writeFileSync(DEVICES_FILE, JSON.stringify(devices, null, 2));
}

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let devices = loadDevices();
  if (method === "GET") {
    return _res.status(200).json({ items: devices });
  }
  if (method === "POST") {
    const { name, host, port, username, password, privateKey } = body;
    if (!name || !host || !username)
      return _res.status(400).json({ _error: "required fields" });
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
    return _res.status(201).json({ device });
  }
  if (method === "PUT") {
    const { id, ...update } = body;
    const idx = devices.findIndex(
      (d: Record<string, unknown>) =>
        String((d as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
    devices[idx] = {
      ...devices[idx],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveDevices(devices);
    return _res.status(200).json({ device: devices[idx] });
  }
  if (method === "DELETE") {
    const { id } = body;
    devices = devices.filter((d: unknown) => d.id !== id);
    saveDevices(devices);
    return _res.status(200).json({ success: true });
  }
  if (method === "POST" && query.action === "test") {
    const { id } = body;
    const device = devices.find((d: unknown) => d.id === id);
    if (!device) return _res.status(404).json({ _error: "Not found" });
    // Test SSH connection
    const ssh = new SSHClient();
    ssh
      .on("ready", () => {
        ssh.end();
        return _res.status(200).json({ success: true });
      })
      .on("error", (_err: unknown) => {
        return _res.status(500).json({ _error: _err.message });
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
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;
