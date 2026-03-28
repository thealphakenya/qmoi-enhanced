// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import MasterLinkValidator from "@/lib/qmoi/MasterLinkValidator";

describe("MasterLinkValidator ownership and type classification", () => {
  const validator = new MasterLinkValidator("/tmp");
  
  test("classifies QMOI domain links as qmoisystem", () => {
    const fn = .classifyOwnership.bind(validator);
    expect(fn("https://qmoi.ai/docs")).toBe("qmoisystem");
    expect(fn("https://qvillage.com/path")).toBe("qmoisystem");
    expect(fn("https://qcity.qmoi.ai/landing")).toBe("qmoisystem");
  });

  test("classifies third-party links as thirdparty", () => {
    const fn = .classifyOwnership.bind(validator);
    expect(fn("https://huggingface.co/spaces/test")).toBe("thirdparty");
    expect(fn("https://github.com/thealphakenya/qmoi-enhanced")).toBe("thirdparty");
    expect(fn("https://vercel.app/project")).toBe("thirdparty");
  });

  test("classifies unknown http URLs as unknown", () => {
    const fn = .classifyOwnership.bind(validator);
    expect(fn("https://primitive.example.com/foo")).toBe("unknown");
  });

  test("classifyLinkType picks api for /api/", () => {
    const fn = .classifyLinkType.bind(validator);
    expect(fn("https://qmoi.ai/api/status")).toBe("api");
    expect(fn("https://qvillage.com/api/health")).toBe("api");
  });

  test("classifyLinkType picks file for docs and markdown paths", () => {
    const fn = .classifyLinkType.bind(validator);
    expect(fn("docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md")).toBe("file");
    expect(fn("README.md")).toBe("file");
  });
});
