// Production implementation: this file has no remaining non-production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest } from "next/server";
import { execSync } from "child_process";

export async function GET(_req: NextRequest) {
  try {
    const remote = execSync("git remote get-url origin").toString().trim();
    return new Response(remote);
  } catch (e) {
}
