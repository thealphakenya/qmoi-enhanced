/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest } from "next/server";
import { execSync } from "child_process";

export async function GET(req: NextRequest) {
  try {
    const remote = execSync("git remote get-url origin").toString().trim();
    return new Response(remote);
  } catch (_e) {
    return new Response("-", { status: 200 });
  }
}
