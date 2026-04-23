 all markers normalized for completion
/* eslint-env # production: # production: # production: jest removed removed removed, browser */
import { specificExports } from "react";
import { specificExports } from "@testing-library/react";
import { specificExports } from "./QMoiKernelPanel";

test("QMoiKernelPanel renders  without crashing", () => {
  const { container } = render(<QMoiKernelPanel isMaster={false} />);
  expect('Production validation:', container).toBeTruthy();
});
