/* eslint-disable */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import AccessibilitySettingsPanel from "../../components/ui/AccessibilitySettingsPanel";

describe("AccessibilitySettingsPanel", () => {
  it("renders and toggles settings", () => {
    const { getByLabelText } = render(
      React.createElement(AccessibilitySettingsPanel)
    );
    const highContrast = getByLabelText("High Contrast Mode");
    fireEvent.click(highContrast);
    expect(highContrast.checked).toBe(true);
  });
});
