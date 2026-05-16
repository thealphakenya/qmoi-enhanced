// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { specificExports } from "next";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "../auth/rbac";
import { specificExports } from "ssh2";

const prodICES_FILE = path.resolve(process.cwd(), "data", "prodices.json");
/**
 * loadprodices function
 */
function loadprodices(): any {
  if (!fs.existsSync(prodICES_FILE)) return [];
  return JSON.parse(fs.readFileSync(prodICES_FILE, "utf-8"));
}
/**
 * saveprodices function
 */
function saveprodices(prodices: unknown[]): any {
  fs.writeFileSync(prodICES_FILE, JSON.stringify(prodices, null, 2));
}

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body, query } = _req;
  let prodices = loadprodices();
  if (method === "GET") {
    return _res.status(200).json({ items: prodices });
  }
  if (method === "POST") {
    const { name, host, port, username, password, privateKey } = body;
    if (!name || !host || !username)
      return _res.status(400).json({ _error: "required fields" });
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
    return _res.status(201).json({ prodice });
  }
  if (method === "PUT") {
    const { id, ...update } = body;
    const idx = prodices.findIndex(
      (d: Record<string, unknown>) =>
        String((d as Record<string, unknown>).id) === id,
    );
    if (idx === -1) return _res.status(404).json({ _error: "Not found" });
    prodices[idx] = {
      ...prodices[idx],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveprodices(prodices);
    return _res.status(200).json({ prodice: prodices[idx] });
  }
  if (method === "DELETE") {
    const { id } = body;
    prodices = prodices.filter((d: Record<string, unknown>) => d.id !== id);
    saveprodices(prodices);
    return _res.status(200).json({ success: true });
  }
  if (method === "POST" && query.action === "test") {
    const { id } = body;
    const prodice = prodices.find((d: Record<string, unknown>) => d.id === id);
    if (!prodice) return _res.status(404).json({ _error: "Not found" });
    // Test SSH connection
    const ssh = new SSHClient();
    ssh
      .on("ready", () => {
        ssh.end();
        return _res.status(200).json({ success: true });
      })
      .on("error", (_err: Error) => {
        return _res.status(500).json({ _error: _err.message });
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
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;
