import { NextRequest } from "next/server"
import { execSync } from "child_process"

export async function GET(req: NextRequest) {
  try {
    const remote = execSync("git remote get-url origin").toString().trim()
    return new Response(remote)
  } catch (e) {
    return new Response("-", { status: 200 })
  }
}
