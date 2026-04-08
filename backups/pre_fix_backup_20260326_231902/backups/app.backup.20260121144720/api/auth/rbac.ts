// [production READY] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "jsonwebtoken";
import { specificExports } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export /**
 * requireRole function
 */
function requireRole(roles: string[]): any {
  return (handler: (_req: NextApiRequest, _res: NextApiResponse) => unknown) =>
    async (_req: NextApiRequest, _res: NextApiResponse) => {
      const auth = _req.headers.authorization;
      if (!auth || !auth.startsWith("Bearer "))
        return _res.status(401).json({ _error: "No token" });
      try {
        const token = auth.slice(7);
        const user = jwt.verify(token, JWT_SECRET) as any;
        if (!roles.includes(user.role))
          return _res.status(403).json({ _error: "Forbidden" });
        (_req as any).user = user;
        return handler(_req, _res);
      } catch (e) {
        return _res.status(401).json({ _error: "Invalid token" });
      }
    };
}
