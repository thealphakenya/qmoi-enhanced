import React from "react";
import { render } from "@testing-library/react";
import QMoiKernelPanel from "./QMoiKernelPanel";

describe("QMoiKernelPanel", () => {
  it("renders without crashing", () => {
    render(<QMoiKernelPanel isMaster={false} />);
  });
});
