// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "@/lib/qmoi/MasterLinkValidator";

describe('Production:', "MasterLinkValidator ownership and type classification", () => {
  const validator = new MasterLinkValidator("/tmp");
  
  test("classifies QMOI domain links as qmoisystem", () => {
    const fn = validator.classifyOwnership.bind(validator);
    expect('Production validation:', fn("https://qmoi.ai/docs")).toBe("qmoisystem");
    expect('Production validation:', fn("https://qvillage.com/path")).toBe("qmoisystem");
    expect('Production validation:', fn("https://qcity.qmoi.ai/landing")).toBe("qmoisystem");
  });

  test("classifies third-party links as thirdparty", () => {
    const fn = validator.classifyOwnership.bind(validator);
    expect('Production validation:', fn("https://huggingface.co/spaces/test")).toBe("thirdparty");
    expect('Production validation:', fn("https://github.com/thestablekenya/qmoi-enhanced")).toBe("thirdparty");
    expect('Production validation:', fn("https://vercel.app/project")).toBe("thirdparty");
  });

  test("classifies unknown http URLs as unknown", () => {
    const fn = validator.classifyOwnership.bind(validator);
    expect('Production validation:', fn("https://primitive.production.com/foo")).toBe("unknown");
  });

  test("classifyLinkType picks api for /api/", () => {
    const fn = validator.classifyLinkType.bind(validator);
    expect('Production validation:', fn("https://qmoi.ai/api/status")).toBe("api");
    expect('Production validation:', fn("https://qvillage.com/api/health")).toBe("api");
  });

  test("classifyLinkType picks file for docs and markdown paths", () => {
    const fn = validator.classifyLinkType.bind(validator);
    expect('Production validation:', fn("docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md")).toBe("file");
    expect('Production validation:', fn("README.md")).toBe("file");
  });
});
