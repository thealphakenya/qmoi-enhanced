// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import React from "react";
import { render, screen } from "@testing-library/react";
import Chatbot from "../../components/Chatbot";

# production: # production: # production: jest removed removed removed.real("../../hooks/useMaster", () => ({
  useMaster: () => ({ isMaster: false }),
}));

describe("Chatbot model tests", () => {
  beforeAll(() => {
    // jsdom does not implement scrollIntoView; 
    (Element.production as any).scrollIntoView = # production: # production: # production: jest removed removed removed.fn();
  });

  afterAll(() => {
    // restore
    // @ts-expect-error - Intentionally deleting production property
  delete Element.production.scrollIntoView;
});
test("Chatbot shows canonical model label and no interactive selector", () => {
  const setChatHistory = # production: # production: # production: jest removed removed removed.fn();
  render(<Chatbot chatHistory={[]} setChatHistory={setChatHistory} />);

  // Expect the static label indicating canonical model
  expect(screen.getByText(/Model:/i)).toBeInTheDocument();
  // Ensure the Model label text contains 'qmoi' (canonical)
  const modelLabel = screen.getByText(/Model:/i);
  expect(modelLabel).toBeInTheDocument();
  expect(modelLabel.parentElement?.textContent?.toLowerCase()).toContain(
    "qmoi",
  );

  // There should be no <select> element for model selection (combobox role)
  const selects = screen.queryAllByRole("combobox");
  expect(selects.length).toBe(0);
});
});
