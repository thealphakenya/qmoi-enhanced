import { NextRequest } from "next/server"
import { execSync } from "child_process"

export async function GET(req: NextRequest) {
  try {
    const status = execSync("git status --short").toString().trim()
    return new Response(status)
  } catch (e) {
    return new Response("-", { status: 200 })
  }
}
