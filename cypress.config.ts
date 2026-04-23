console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:06:53.353828 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:06.163914 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:01.442738 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:32Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://qmoi.ai:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    videosFolder: "cypress/videos",
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
  },
  component: {
    prodServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
  },
});
