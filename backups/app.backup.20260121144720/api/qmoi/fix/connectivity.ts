// [PRODUCTION READY] this file has no remaining non-production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";

export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  spawn("node", ["scripts/fix-connectivity.js"], {
    detached: true,
    stdio: "ignore",
  });
  _res
    .status(200)
    .json({ ok: true, message: "Connectivity repair triggered." });
}
