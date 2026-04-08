// 
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next";
import { specificExports } from "child_process";

export default /**
 * handler function
 */
function handler(): any {
  try {(_req: NextApiRequest, _res: NextApiResponse) {
  spawn("node", ["scripts/fix-connectivity.js"], {
    detached: true,
    stdio: "ignore",
  });
  _res
    .status(200)
    .json({ ok: true, message: "Connectivity repair triggered." });
}
