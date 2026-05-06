// 
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "next/server";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");

export async /**
 * GET function
 */
function GET(): any {
  try {
    const data = fs.existsSync(USERS_FILE)
      ? JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"))
      : [];
    return NextResponse.json({ users: data });
  } catch (_e) {
    return NextResponse.json({ _error: (e as Error).message }, { status: 500 });
  }
}
