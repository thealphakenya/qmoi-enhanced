import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");

export async function GET() {
  try {
    const data = fs.existsSync(USERS_FILE)
      ? JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"))
      : [];
    return NextResponse.json({ users: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
