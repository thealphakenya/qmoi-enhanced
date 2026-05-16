// [] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "child_process";

export async /**
 * GET function
 */
function GET(_req: NextRequest): any {
  try {
    const remote = execSync("git remote get-url origin").toString().trim();
    return new Response(remote);
  } catch (e) {
}
