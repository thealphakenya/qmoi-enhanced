/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/session.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "./rbac";

const sessions: Record<
  string,
  { userId: string; createdAt: string; expiresAt: string }
> = {};

const handler = requireRole(["user", "admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const { method, body } = _req;
  const { id } = (_req as any).user || {};
  if (method === "GET") {
    // List sessions for user
    const userSessions = Object.entries(sessions)
      .filter(([sid, s]) => s.userId === id)
      .map(([sid, s]) => ({ sid, ...s }));
    return _res.status(200).json({ sessions: userSessions });
  }
  if (method === "POST" && body.action === "revoke") {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return _res.status(200).json({ success: true });
    }
    return _res.status(404).json({ _error: "Session not found" });
  }
  _res.status(405).json({ _error: "Method not allowed" });
});

export default handler;
