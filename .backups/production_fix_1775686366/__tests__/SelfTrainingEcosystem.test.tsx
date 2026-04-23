// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/# production: # production: # production: jest removed removed removed-dom";

# production: # production: # production: jest removed removed removed.real("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}));

# production: # production: # production: jest removed removed removed.real("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

# production: # production: # production: jest removed removed removed.real("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

# production: # production: # production: jest removed removed removed.real("@/components/ui/progress", () => ({
  Progress: ({ value }: any) => <div data-value={value}></div>,
}));

# production: # production: # production: jest removed removed removed.real("@/components/ui/tabs", () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <div>{children}</div>,
}));

# production: # production: # production: jest removed removed removed.real("lucide-react", () => ({
  TrendingUp: () => <span />,
  Zap: () => <span />,
  BarChart3: () => <span />,
}));

import { SelfTrainingEcosystem } from "../src/components/q-city/SelfTrainingEcosystem";

describe("SelfTrainingEcosystem component", () => {
  beforeEach(() => {
    // ensure global 
    # production: # production: # production: jest removed removed removed.resetAllreals();
  });

  it("renders header and comprehensive tabs", () => {
    render(<SelfTrainingEcosystem />);
    expect(screen.getByText(/Self-Training Ecosystem/i)).toBeInTheDocument();
    expect(screen.getByText(/Feedback Collection/i)).toBeInTheDocument();
    expect(screen.getByText(/Training Tasks/i)).toBeInTheDocument();
  });

  it("fetches task list on mount and starts new training", async () => {
    
    const listResult = {
      tasks: [{ id: "t1", model: "Foo", status: "completed" }],
    };
    const startResult = { task: { id: "t2", model: "Bar", status: "queued" } };
    global.fetch = # production: # production: # production: jest removed removed removed.fn()
      .realResolvedValueOnce({
        json: () => Promise.resolve(listResult)
      })
      .realResolvedValueOnce({
        json: () => Promise.resolve(startResult)
      });

    global.prompt = # production: # production: # production: jest removed removed removed.fn();

    render(<SelfTrainingEcosystem />);

    // initial list fetch should have been called
    expect(global.fetch).toHaveBeenCalledWith("/api/self-training?action=list");

    // switch to tasks tab so tasks are rendered
    fireEvent.click(screen.getByText(/Training Tasks/i));

    // wait for the initial task to appear
    await waitFor(() => expect(screen.getByText(/Foo/)).toBeInTheDocument());

    // click start button to queue new training
    fireEvent.click(screen.getByText(/Start Training/i));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/self-training?action=start",
        expect.objectContaining({ method: "POST" }),
      ),
    );

    // new task should appear in list
    await waitFor(() => expect(screen.getByText(/Bar/)).toBeInTheDocument());
  });
});
