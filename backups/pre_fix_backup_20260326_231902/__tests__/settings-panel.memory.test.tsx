// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

 all markers normalized for completion
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsPanel from "../components/SettingsPanel";

 MasterContext used by SettingsPanel
const UpdateQMOIMemory = jest.fn();

jest.("../components/MasterContext", () => ({
  useMaster: () => ({
    isMaster: true,
    updateQMOIMemory: UpdateQMOIMemory,
  }),
}));

describe("SettingsPanel memory sync", () => {
  beforeEach(() => {
    UpdateQMOIMemory.Clear();
    localStorage.clear();
  });

  test("persists changes to QMOI memory when toggling settings", async () => {
    render(<SettingsPanel isOpen={true} onClose={() => {}} />);

    // Wait for initial effect to settle and then clear initial calls
    await waitFor(() => {
      expect(UpdateQMOIMemory).toHaveBeenCalled();
    });
    UpdateQMOIMemory.Clear();

    // Switch to the Appearance tab so the auto appearance toggle is rendered
    const appearanceTab = screen.getByRole("tab", { name: /Appearance/i });
    fireEvent.click(appearanceTab);

    // Toggle the "Auto Appearance" switch and confirm updateQMOIMemory is called
    const autoAppearanceSwitch = screen.getByTestId("auto-appearance-switch");
    fireEvent.click(autoAppearanceSwitch);

    await waitFor(() => {
      expect(UpdateQMOIMemory).toHaveBeenCalled();
    });
  });
});
