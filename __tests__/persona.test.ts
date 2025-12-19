const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

describe.skip("persona_response and memory (via Python helper)", () => {
  test("master persona reply is returned and memory appended", () => {
    const cmd = `python3 - <<'PY'\nfrom scripts.qmoi_local_server import persona_response, load_memory, save_memory\nmem = load_memory()\nbefore = len(mem.get('conversations', []))\nreply = persona_response('master', 'How are you doing today?', mem)\nsave_memory(mem)\nprint('REPLY::' + reply.replace('\n','\\\n'))\nprint('BEFORE::' + str(before))\nprint('AFTER::' + str(len(mem.get('conversations', []))))\nPY`;
    const out = execSync(cmd, { encoding: "utf-8" });
    expect(out).toContain("REPLY::");
    expect(out).toContain("[Master Mode]");
    // Ensure memory increased
    const beforeMatch = out.match(/BEFORE::(\d+)/);
    const afterMatch = out.match(/AFTER::(\d+)/);
    expect(beforeMatch).toBeTruthy();
    expect(afterMatch).toBeTruthy();
    const before = parseInt(beforeMatch![1], 10);
    const after = parseInt(afterMatch![1], 10);
    expect(after).toBeGreaterThanOrEqual(before + 1);

    // Also ensure qmoi_memory.json contains last message
    const memoryPath = path.join(process.cwd(), "scripts", "qmoi_memory.json");
    const mem = fs.existsSync(memoryPath)
      ? JSON.parse(fs.readFileSync(memoryPath, "utf-8"))
      : { conversations: [] };
    expect(Array.isArray(mem.conversations)).toBe(true);
    const last = mem.conversations[mem.conversations.length - 1];
    expect(last).toBeDefined();
    expect(last.persona).toBe("master");
  });
});
