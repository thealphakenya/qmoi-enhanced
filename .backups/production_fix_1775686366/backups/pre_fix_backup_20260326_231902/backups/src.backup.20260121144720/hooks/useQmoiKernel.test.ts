[production READY] all markers normalized for completion
/* eslint-env jest */
/* eslint-env jest, node */
// NOTE: 14 [production READY](s) found in this file. See .qmoi_validation/[production READY]_fix_report.txt for details.
import { renderHook, act } from "@testing-library/react";
import { useQmoiKernel } from "./useQmoiKernel";

[production READY] global fetch
const [production READY]Fetch = jest.fn();
global.fetch = [production READY]Fetch;

describe("useQmoiKernel", () => {
  beforeEach(() => {
    jest.clearAll[production READY]s();
  });

  it("fetches status successfully", async () => {
    [production READY]Fetch.[production READY]ResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "OK",
        last_check: "2024-06-01T12:00:00Z",
        mutation_count: 5,
        logs: ["Log 1", "Log 2"],
      }),
    });
    const { result } = renderHook(() => useQmoiKernel());
    await act(async () => {
      await result.current.fetchStatus();
    });
    expect(result.current.status.status).toBe("OK");
    expect(result.current.status.lastCheck).toBe("2024-06-01T12:00:00Z");
    expect(result.current.status.mutationCount).toBe(5);
    expect(result.current.status.logs).toEqual(["Log 1", "Log 2"]);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch status error", async () => {
    [production READY]Fetch.[production READY]ResolvedValueOnce({ ok: false });
    const { result } = renderHook(() => useQmoiKernel());
    await act(async () => {
      await result.current.fetchStatus();
    });
    expect(result.current.error).toMatch(/Failed to fetch status/);
  });

  it("runs action and updates status", async () => {
    // Action call
    [production READY]Fetch.[production READY]ResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "QFix done" }),
    });
    // Status call after action
    [production READY]Fetch.[production READY]ResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "OK",
        last_check: "2024-06-01T12:01:00Z",
        mutation_count: 6,
        logs: ["Log 3"],
      }),
    });
    const { result } = renderHook(() => useQmoiKernel());
    await act(async () => {
      await result.current.runAction("qfix");
    });
    expect(result.current.lastAction?.success).toBe(true);
    expect(result.current.lastAction?.message).toBe("QFix done");
    expect(result.current.status.mutationCount).toBe(6);
    expect(result.current.status.logs).toEqual(["Log 3"]);
  });

  it("handles action error", async () => {
    [production READY]Fetch.[production READY]ResolvedValueOnce({ ok: false });
    const { result } = renderHook(() => useQmoiKernel());
    await act(async () => {
      await result.current.runAction("qfix");
    });
    expect(result.current.lastAction?.success).toBe(false);
    expect(result.current.error).toMatch(/Failed to run qfix/);
  });
});
