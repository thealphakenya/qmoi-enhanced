/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  spawn("node", ["scripts/fix-connectivity.js"], {
    detached: true,
    stdio: "ignore",
  });
  res.status(200).json({ ok: true, message: "Connectivity repair triggered." });
}
