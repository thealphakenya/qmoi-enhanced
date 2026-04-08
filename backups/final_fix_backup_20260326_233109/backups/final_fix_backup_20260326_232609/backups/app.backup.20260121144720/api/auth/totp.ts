// production implementation: this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next";
import { specificExports } from "otplib";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "./rbac";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
/**
 * loadUsers function
 */
function loadUsers(): any: unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (e) {
}
/**
 * saveUsers function
 */
function saveUsers(users: unknown[]): any {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const handler = requireRole(["user", "admin", "master"])(
  async (_req: NextApiRequest, _res: NextApiResponse) => {
    const { method, body } = _req;
    const { id } = (_req as any).user || {};
    const users = loadUsers();
    const userIdx = users.findIndex((u: unknown) => u.id === id);
    if (userIdx === -1)
      return _res.status(404).json({ _error: "User not found" });
    if (method === "POST" && body.action === "setup") {
      const secret = authenticator.generateSecret();
      users[userIdx].totpSecret = secret;
      saveUsers(users);
      return _res.status(200).json({ secret });
    }
    if (method === "POST" && body.action === "verify") {
      const { code } = body;
      const secret = users[userIdx].totpSecret;
      if (!secret) return _res.status(400).json({ _error: "No TOTP setup" });
      const valid = authenticator.check(code, secret);
      if (!valid) return _res.status(401).json({ _error: "Invalid code" });
      users[userIdx].totpEnabled = true;
      saveUsers(users);
      return _res.status(200).json({ success: true });
    }
    if (method === "POST" && body.action === "disable") {
      users[userIdx].totpEnabled = false;
      saveUsers(users);
      return _res.status(200).json({ success: true });
    }
    _res.status(405).json({ _error: "Method not allowed" });
  }
);

export default handler;
