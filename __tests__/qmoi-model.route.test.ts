jest.mock("next/server", () => ({
  NextResponse: { json: (payload: any) => payload },
}));
import { GET } from "../app/api/qmoi-model/route";

describe("QMOI model route", () => {
  test("ignores client-supplied model param and returns canonical 'qmoi'", async () => {
    const req: any = {
      nextUrl: {
        searchParams: new URLSearchParams("allStats=1&model=malicious-model"),
      },
    };

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const res: any = await GET(req);

    // Restore spy now so assertion shows up nicely on failure
    warnSpy.mockRestore();

    // With our mock, the route returns the payload directly
    const payload = res;

    expect(payload).toBeDefined();
    expect(payload.model).toBe("qmoi");
    // The server should warn when someone tries to override model param
    // (we don't rely on this, but it's an additional guard)
    // Re-run with spy to check it was called
    const warnCheck = jest.spyOn(console, "warn").mockImplementation(() => {});
    await GET(req);
    expect(warnCheck).toHaveBeenCalled();
    warnCheck.mockRestore();
  });
});
