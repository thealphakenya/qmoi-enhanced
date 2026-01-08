import { QmoiMemory, _resetQmoiMemoryForTests } from "../QmoiMemory";

describe("QmoiMemory service", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "test";
    _resetQmoiMemoryForTests();
    // clear fetch mock
    // @ts-expect-error - test environment manipulation
    delete (global as unknown as { fetch?: unknown }).fetch;
  });

  test("save and get should store and retrieve values", () => {
    QmoiMemory.save("k1", { x: 1 }, "user1", "proj1");
    const v = QmoiMemory.get("k1", "user1", "proj1");
    expect(v).toEqual({ x: 1 });
  });

  test("list returns saved items and merges server conversations", async () => {
    QmoiMemory.save("k2", { hello: "world" }, "user2");

    // mock fetch to return a conversation
    // @ts-expect-error - test environment manipulation
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            profiles: {},
            conversations: [
              {
                role: "assistant",
                timestamp: "2025-01-01T00:00:00Z",
                text: "hi",
              },
            ],
          }),
      })
    );

    const listBefore = QmoiMemory.list("user2");
    // ensure our saved item is present
    expect(listBefore.some((r) => r.key === "k2")).toBe(true);

    // allow background fetch to run
    await new Promise((r) => setTimeout(r, 50));
    const combined = QmoiMemory.list();
    expect(combined.some((r) => r.key === "conversation")).toBeTruthy();
    const conv = combined.find((r) => r.key === "conversation");
    expect(conv).toBeDefined();
    const convValue = conv && (conv.value as unknown);
    expect(convValue).toBeDefined();
    expect(
      typeof convValue === "object" &&
        convValue !== null &&
        "text" in (convValue as Record<string, unknown>)
    ).toBeTruthy();
  });
});
