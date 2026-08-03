/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/plugins.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { requireRole } from "../auth/rbac";

const PLUGIN_DIR = path.resolve(process.cwd(), "plugins");

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  if (_req.method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(PLUGIN_DIR)) return _res.status(200).json({ plugins: [] });
  const files = fs
    .readdirSync(PLUGIN_DIR)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
  _res.status(200).json({ plugins: files });
});

export default handler;
