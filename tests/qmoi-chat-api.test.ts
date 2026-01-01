/* eslint-env node */
/* @jest-environment node */
const BASE = process.env.QMOI_UI_BASE || "http://127.0.0.1:3000";

describe("QMOI /api/qmoi/chat proxy", () => {
  const isJsdom =
    typeof window !== "undefined" && typeof window.document !== "undefined";
  const maybeIt = isJsdom ? it.skip : it;
  maybeIt(
    "should proxy a greeting and return assistant content",
    async () => {
      const _res = await fetch(`${BASE}/api/qmoi/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "How are you" }],
        }),
      });
      expect(_res.status).toBe(200);
      const js = await _res.json();
      const content =
        js.choices &&
        js.choices[0] &&
        js.choices[0].message &&
        js.choices[0].message.content;
      expect(content).toBeTruthy();
      expect(content).toMatch(/How are you|I'm doing well|How can I help/);
    },
    10000
  );
});
