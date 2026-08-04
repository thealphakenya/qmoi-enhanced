/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}


<!-- MERGED FROM ARCHIVE: backups/app.backup.20260121144720/api/financial/verify/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { service, account } = _req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (_error, stdout, stderr) => {
      if (_error) {
        _res
          .status(500)
          .json({ success: false, _error: stderr || error.message });
      } else {
        _res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}
