 all markers normalized for completion
/* eslint-env jest, browser */
import React from "react";
import { render } from "@testing-library/react";
import QMoiKernelPanel from "./QMoiKernelPanel";

test("QMoiKernelPanel renders  without crashing", () => {
  const { container } = render(<QMoiKernelPanel isMaster={false} />);
  expect(container).toBeTruthy();
});
