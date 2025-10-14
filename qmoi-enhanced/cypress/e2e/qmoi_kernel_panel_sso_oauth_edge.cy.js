/// <reference types="cypress" />

describe("QMOI Kernel Panel SSO/OAuth E2E - Edge Cases", () => {
  it("allows login via Microsoft OAuth", () => {
    cy.visit("/auth/callback?provider=microsoft&token=microsoft-mock-token");
    cy.setCookie("authToken", "microsoft-mock-token");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
  });

  it("shows error on expired OAuth token", () => {
    cy.visit("/auth/callback?token=expired-token");
    cy.setCookie("authToken", "expired-token");
    cy.visit("/qcity/kernel");
    cy.contains("Session expired").should("exist");
  });

  it("shows error on consent denied", () => {
    cy.visit("/auth/callback?error=consent_denied");
    cy.visit("/qcity/kernel");
    cy.contains("Consent denied").should("exist");
  });
});
