/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { service, account } = req.body;
  exec(
    `python scripts/financial_verification.py ${service} ${account}`,
    (error, stdout, stderr) => {
      if (error) {
        res
          .status(500)
          .json({ success: false, error: stderr || error.message });
      } else {
        res.status(200).json({ success: true, result: stdout });
      }
    },
  );
}
