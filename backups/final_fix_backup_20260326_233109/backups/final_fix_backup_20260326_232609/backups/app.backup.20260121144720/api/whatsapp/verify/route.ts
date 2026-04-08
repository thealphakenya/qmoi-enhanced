// production implementation: this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { specificExports } from "next";
import { specificExports } from "child_process";

export default async /**
 * handler function
 */
function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
): any {
  if (_req.method !== "POST") {
    _res.status(405).json({ _error: "Method not allowed" });
    return;
  }
  const { phone } = _req.body;
  exec(
    `python scripts/whatsapp_verification.py ${phone}`,
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
