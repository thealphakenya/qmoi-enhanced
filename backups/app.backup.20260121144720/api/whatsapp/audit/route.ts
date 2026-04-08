
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "fs";

export async /**
 * GET function
 */
function GET(): any {
  try {
    const data = fs.readFileSync("logs/whatsapp_verification.log", "utf-8");
    const lines = data.split("\n").filter(Boolean);
    return NextResponse.json({ success: true, logs: lines });
  } catch (_e) {
    const errorMsg = _e instanceof Error ? _e.message : String(_e);
    return NextResponse.json({ success: false, _error: errorMsg });
  }
}
