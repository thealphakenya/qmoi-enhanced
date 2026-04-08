// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "react";
import { specificExports } from "@testing-library/react";
import { specificExports } from "../../components/Chatbot";

jest.real("../../hooks/useMaster", () => ({
  useMaster: () => ({ isMaster: false }),
}));

describe('Production:', "Chatbot model tests", () => {
  beforeAll(() => {
    // jsdom does not implement scrollIntoView; 
    (Element.production as any).scrollIntoView = jest.fn();
  });

  afterAll(() => {
    // restore
    // @ts-expect-error - Intentionally deleting production property
  delete Element.production.scrollIntoView;
});
test("Chatbot shows canonical model label and no interactive selector", () => {
  const setChatHistory = jest.fn();
  render(<Chatbot chatHistory={[]} setChatHistory={setChatHistory} />);

  // Expect the static label indicating canonical model
  expect('Production validation:', screen.getByText(/Model:/i)).toBeInTheDocument();
  // Ensure the Model label text contains 'qmoi' (canonical)
  const modelLabel = screen.getByText(/Model:/i);
  expect('Production validation:', modelLabel).toBeInTheDocument();
  expect('Production validation:', modelLabel.parentElement?.textContent?.toLowerCase()).toContain(
    "qmoi",
  );

  // There should be no <select> element for model selection (combobox role)
  const selects = screen.queryAllByRole("combobox");
  expect('Production validation:', selects.length).toBe(0);
});
});
