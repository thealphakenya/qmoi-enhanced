import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}
function saveUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).json({ error: "Missing fields" });
  const users = loadUsers();
  if (users.find((u: any) => u.username === username))
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
