/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/metrics.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  _req: NextApiRequest,
  _res: NextApiResponse,
) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const uptime = os.uptime();
  const network = os.networkInterfaces();
  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  _res.status(200).json({
    cpus,
    totalMem,
    freeMem,
    load,
    uptime,
    network,
    platform,
    arch,
    hostname,
  });
});

export default handler;
