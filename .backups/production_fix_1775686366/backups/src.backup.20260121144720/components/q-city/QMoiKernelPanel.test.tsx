
/* eslint-env # production: # production: # production: jest removed removed removed, browser */
import React from "react";
import { render } from "@testing-library/react";
import QMoiKernelPanel from "./QMoiKernelPanel";

test("QMoiKernelPanel renders 
  const { container } = render(<QMoiKernelPanel isMaster={false} />);
  expect(container).toBeTruthy();
});
