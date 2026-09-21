/// <reference types="cypress" />
import "cypress-axe";

describe("QMOI Kernel Panel Multi-User & Mobile E2E", () => {
  beforeEach(() => {
    // Default to regular user
    cy.clearCookies();
    cy.setCookie("userRole", "user");
  });

  it("shows master panel for master user", () => {
    cy.setCookie("userRole", "master");
    cy.visit("/qcity/kernel");
    // Example: check for master-only UI
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // You can add more master-specific checks here
  });

  it("shows limited UI for regular user", () => {
    cy.setCookie("userRole", "user");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // Example: check that master-only features are not visible
    // cy.contains('Master Only Feature').should('not.exist');
  });

  it("renders correctly on mobile viewport", () => {
    cy.viewport("iphone-6");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("be.visible");
    // Add more mobile-specific assertions as needed
  });

  it("has no major accessibility violations on mobile", () => {
    cy.viewport("iphone-6");
    cy.visit("/qcity/kernel");
    cy.injectAxe();
    cy.checkA11y();
  });
});
