import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QMoiKernelPanel from "./QMoiKernelPanel";

// MSW setup is handled in src/setupTests.ts

describe("QMoiKernelPanel Integration", () => {
  it("fetches and displays status from API", async () => {
    render(<QMoiKernelPanel isMaster={true} />);
    expect(await screen.findByText("OK")).toBeInTheDocument();
    expect(screen.getByText("Log 1")).toBeInTheDocument();
    expect(screen.getByText("Log 2")).toBeInTheDocument();
  });

  it("runs QFix and updates last action", async () => {
    render(<QMoiKernelPanel isMaster={true} />);
    fireEvent.click(screen.getByRole("button", { name: /Run QFix/i }));
    await waitFor(() =>
      expect(screen.getByText(/Last Action:/)).toBeInTheDocument(),
    );
    expect(screen.getByText("QFix done")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    // Override handler to simulate error
    const { server } = require("../../mocks/server");
    server.use(
      require("msw").rest.get("/api/qmoi/status", (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );
    render(<QMoiKernelPanel isMaster={true} />);
    await waitFor(() => expect(screen.getByText(/Error:/)).toBeInTheDocument());
  });
});
