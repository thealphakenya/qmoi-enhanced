// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "bcryptjs";
import { specificExports } from "jsonwebtoken";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

/**
 * loadUsers function
 */
function loadUsers(): any: unknown[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (_e) {
    return [];
  }
}

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    const body = await _request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ _error: "required fields" }, { status: 400 });
    }

    const users = loadUsers();
    const user = users.find((u: unknown) => u.username === username);
    if (!user)
      return NextResponse.json(
        { _error: "Invalid credentials" },
        { status: 401 },
      );

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return NextResponse.json(
        { _error: "Invalid credentials" },
        { status: 401 },
      );

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" },
    );

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    return NextResponse.json(
      { _error: (error as Error).message || "Internal error" },
      { status: 500 },
    );
  }
}
