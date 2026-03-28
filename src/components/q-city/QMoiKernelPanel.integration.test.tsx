// QMOI EVOLUTION ENHANCED: Integration test for QMoiKernelPanel
import React from "react";
import { render, screen } from "@testing-library/react";
import QMoiKernelPanel from "./QMoiKernelPanel";

describe("QMoiKernelPanel Integration", () => {
  it("renders without crashing in non-master mode", () => {
    render(<QMoiKernelPanel isMaster={false} />);
    expect(screen.queryByText(/QMOI Kernel Control Panel/i)).not.toBeInTheDocument();
  });
});
