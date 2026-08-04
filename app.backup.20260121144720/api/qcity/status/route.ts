// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qcity/status/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

const devices = [
  {
    id: "qcity",
    name: "QCity Main",
    type: "cloud",
    status: "online",
    cpu: os.cpus().length,
    mem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  },
  // Add more devices as needed
];
let offloading = true;

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  if (_req.method === "GET") {
    return _res.status(200).json({
      devices,
      offloading,
      activeDevices: devices.filter((d) => d.status === "online"),
      timestamp: new Date().toISOString(),
    });
  }
  if (_req.method === "POST") {
    if (typeof _req.body?.offloading === "boolean")
      offloading = _req.body.offloading;
    return _res.status(200).json({ offloading });
  }
  _res.status(405).end();
}
