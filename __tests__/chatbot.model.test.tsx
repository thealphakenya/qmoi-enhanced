import React from "react";
import { render, screen } from "@testing-library/react";
import Chatbot from "../components/Chatbot";

// Mock MasterContext so components that call useMaster() don't throw
jest.mock("../components/MasterContext", () => ({
  useMaster: () => ({ isMaster: false }),
}));
beforeAll(() => {
  // jsdom does not implement scrollIntoView; mock it for components that call it
  Element.prototype.scrollIntoView = jest.fn();
});

afterAll(() => {
  // restore
  // @ts-ignore
  delete Element.prototype.scrollIntoView;
});
test("Chatbot shows canonical model label and no interactive selector", () => {
  const setChatHistory = jest.fn();
  render(<Chatbot chatHistory={[]} setChatHistory={setChatHistory} />);

  // Expect the static label indicating canonical model
  expect(screen.getByText(/Model:/i)).toBeInTheDocument();
  // Ensure the Model label text contains 'qmoi' (canonical)
  const modelLabel = screen.getByText(/Model:/i);
  expect(modelLabel).toBeInTheDocument();
  expect(modelLabel.parentElement?.textContent?.toLowerCase()).toContain(
    "qmoi"
  );

  // There should be no <select> element for model selection (combobox role)
  const selects = screen.queryAllByRole("combobox");
  expect(selects.length).toBe(0);
});
