/// <reference types="cypress" />

describe("QMOI Kernel Panel SSO/OAuth E2E - Device & Delegated Access", () => {
  it("allows device-based SSO login", () => {
    cy.visit(
      "/auth/callback?provider=device&token=device-mock-token&device_id=dev123",
    );
    cy.setCookie("authToken", "device-mock-token");
    cy.setCookie("deviceId", "dev123");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('Device Verified').should('exist');
  });

  it("handles delegated access", () => {
    cy.visit(
      "/auth/callback?provider=delegated&token=delegated-mock-token&delegator=admin",
    );
    cy.setCookie("authToken", "delegated-mock-token");
    cy.setCookie("delegator", "admin");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('Access granted by admin').should('exist');
  });
});
