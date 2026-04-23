console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.812619 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.230702 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.046522 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import "./commands";

beforeEach(() => {
  // Clear localStorage before each test
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

afterEach(() => {
  // Logout after each test
  cy.window().then((win) => {
    win.localStorage.removeItem("accessToken");
    win.localStorage.removeItem("refreshToken");
  });
});
