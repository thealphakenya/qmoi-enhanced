import { NextRequest } from "next/server"
import { execSync } from "child_process"

export async function GET(req: NextRequest) {
  try {
    const branch = execSync("git branch --show-current").toString().trim()
    return new Response(branch)
  } catch (e) {
    return new Response("-", { status: 200 })
  }
}
