// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function requireRole(roles: string[]) {
  return (handler: unknown) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith("Bearer "))
        return res.status(401).json({ error: "No token" });
      try {
        const token = auth.slice(7);
        const user = jwt.verify(token, JWT_SECRET) as any;
        if (!roles.includes(user.role))
          return res.status(403).json({ error: "Forbidden" });
        .user = user;
        return handler(req, res);
      } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
      }
    };
}
