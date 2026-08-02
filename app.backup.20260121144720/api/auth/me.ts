/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/me.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const auth = _req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return _res.status(401).json({ _error: "No token" });
  try {
    const token = auth.slice(7);
    const user = jwt.verify(token, JWT_SECRET);
    _res.status(200).json({ user });
  } catch (e) {
    _res.status(401).json({ _error: "Invalid token" });
  }
}
