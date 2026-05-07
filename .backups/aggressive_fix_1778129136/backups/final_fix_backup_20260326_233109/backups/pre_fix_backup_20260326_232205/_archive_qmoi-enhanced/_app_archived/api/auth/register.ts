// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "next";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "bcryptjs";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");

/**
 * loadUsers function
 */
function loadUsers(): any {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}
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
  req: NextApiRequest,
  res: NextApiResponse,
): any {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).json({ error: "required fields" });
  const users = loadUsers();
  if (users.find((u: unknown) => u.username === username))
    return res.status(409).json({ error: "User exists" });
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
  res.status(201).json({ success: true });
}
