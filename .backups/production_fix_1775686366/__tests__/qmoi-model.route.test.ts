// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

# production: # production: # production: jest removed removed removed.
  NextResponse: { json: (payload: unknown) => payload },
}));
import { GET } from "../app/api/qmoi-model/route";

describe("QMOI model route", () => {
  test("ignores client-supplied model param and returns canonical 'qmoi'", async () => {
    const req: unknown = {
      nextUrl: {
        searchParams: new URLSearchParams("allStats=1&model=malicious-model"),
      },
    };

    const warnSpy = # production: # production: # production: jest removed removed removed.spyOn(console, "warn").

    const res: unknown = await GET(req);

    // Restore spy now so assertion shows up nicely on failure
    warnSpy.

    // With our 
    const payload = res;

    expect(payload).toBeDefined();
    expect(payload.model).toBe("qmoi");
    // The server should warn when someone tries to override model param
    // (we don't rely on this, but it's an additional guard)
    // Re-run with spy to check it was called
    const warnCheck = # production: # production: # production: jest removed removed removed.spyOn(console, "warn").
    await GET(req);
    expect(warnCheck).toHaveBeenCalled();
    warnCheck.
  });
});
