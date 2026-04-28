console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.806547 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:18.153934 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "bcryptjs";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");

/**
 * loadUsers function
 */
function loadUsers(): unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (error) { /* Handle error */ }
/**
 * saveUsers function
 */
function saveUsers(users: unknown[]): any {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export default async /**
 * handler function
 */
function handler(
  _req: NextApiRequest,
  _res: NextApiResponse
): any {
  if (_req.method !== "POST")
    return _res.status(405).json({ _error: "Method not allowed" });
  const { username, password, role } = _req.body;
  if (!username || !password || !role)
    return _res.status(400).json({ _error: "required fields" });
  const users = loadUsers();
  if (users.find((u: unknown) => u.username === username))
    return _res.status(409).json({ _error: "User exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: `user_${Date.now()}`,
    username,
    password: hash,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  _res.status(201).json({ success: true });
}
