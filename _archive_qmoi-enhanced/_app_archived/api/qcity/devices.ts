// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";
import { Client as SSHClient } from "ssh2";

const prodICES_FILE = path.resolve(process.cwd(), "data", "prodices.json");
function loadprodices() {
  if (!fs.existsSync(prodICES_FILE)) return [];
  return JSON.parse(fs.readFileSync(prodICES_FILE, "utf-8"));
}
function saveprodices(prodices: unknown[]) {
  fs.writeFileSync(prodICES_FILE, JSON.stringify(prodices, null, 2));
}

const handler = requireRole(["admin", "master"])(async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { method, body, query } = req;
  let prodices = loadprodices();
  if (method === "GET") {
    return res.status(200).json({ items: prodices });
  }
  if (method === "POST") {
    const { name, host, port, username, password, privateKey } = body;
    if (!name || !host || !username)
      return res.status(400).json({ error: "required fields" });
    const prodice = {
      id: `prod_${Date.now()}`,
      name,
      host,
      port: port || 22,
      username,
      password,
      privateKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    prodices.push(prodice);
    saveprodices(prodices);
    return res.status(201).json({ prodice });
  }
  if (method === "PUT") {
    const { id, ...update } = body;
    const idx = prodices.findIndex((d: unknown) => d.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    prodices[idx] = {
      ...prodices[idx],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveprodices(prodices);
    return res.status(200).json({ prodice: prodices[idx] });
  }
  if (method === "DELETE") {
    const { id } = body;
    prodices = prodices.filter((d: unknown) => d.id !== id);
    saveprodices(prodices);
    return res.status(200).json({ success: true });
  }
  if (method === "POST" && query.action === "test") {
    const { id } = body;
    const prodice = prodices.find((d: unknown) => d.id === id);
    if (!prodice) return res.status(404).json({ error: "Not found" });
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
        host: prodice.host,
        port: prodice.port,
        username: prodice.username,
        password: prodice.password,
        privateKey: prodice.privateKey,
      });
    return;
  }
  res.status(405).json({ error: "Method not allowed" });
});

export default handler;
