// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import { requireRole } from "../auth/rbac";

const handler = requireRole(["admin", "master"])(async (
  req: NextApiRequest,
  res: NextApiResponse,
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
  res.status(200).json({
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
