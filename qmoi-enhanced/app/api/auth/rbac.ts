import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function requireRole(roles: string[]) {
  return (handler: any) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith("Bearer "))
        return res.status(401).json({ error: "No token" });
      try {
        const token = auth.slice(7);
        const user = jwt.verify(token, JWT_SECRET) as any;
        if (!roles.includes(user.role))
          return res.status(403).json({ error: "Forbidden" });
        (req as any).user = user;
        return handler(req, res);
      } catch {
        return res.status(401).json({ error: "Invalid token" });
      }
    };
}
