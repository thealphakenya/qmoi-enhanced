// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AlphaQAISystem from "@/components/alpha-q-ai-system";

describe("AlphaQAISystem", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "operational",
        model_used: "stable-Q-1.2.3",
        tasks: [{ id: "task-1" }, { id: "task-2" }],
      }),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the component with initial content and updates state from API", async () => {
    render(<AlphaQAISystem />);

    expect(screen.getByText(/stable-Q AI System/i)).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/Version:/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/stable-Q-1.2.3/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Jobs:/i)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();
    });
  });
});
