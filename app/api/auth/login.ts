/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

export default async function handler(_req: NextApiRequest,
  _res: NextApiRespons_e,
) {
  if (_req.method !== "POST")
    return _res.status(405).json({ _error: "Method not allowed" });
  const { username, password } = _req.body;
  if (!username || !password)
    return _res.status(400).json({ _error: "Missing fields" });
  const users = loadUsers();
  const user = users.find((u: unknown) => u.username === username);
  if (!user) return _res.status(401).json({ _error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return _res.status(401).json({ _error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" },
  );
  _res.status(200).json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
}
