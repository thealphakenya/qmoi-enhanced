import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
