import React from "react";
import { render, screen } from "@testing-library/react";
import QMoiKernelPanel from "./QMoiKernelPanel";

describe("QMoiKernelPanel", () => {
  test("renders the kernel control panel", () => {
    render(<QMoiKernelPanel isMaster={true} />);
    expect(screen.getByText(/QMOI Kernel Control Panel/i)).toBeInTheDocument();
  });
});
