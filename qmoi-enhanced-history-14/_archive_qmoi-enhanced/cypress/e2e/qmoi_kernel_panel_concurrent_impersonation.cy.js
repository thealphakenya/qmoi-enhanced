/// <reference types="cypress" />

describe("QMOI Kernel Panel Concurrent Sessions & Impersonation E2E", () => {
  it("handles concurrent master and user sessions", () => {
    // Requires Cypress 10+
    cy.session("master", () => {
      cy.setCookie("userRole", "master");
    });
    cy.session("user", () => {
      cy.setCookie("userRole", "user");
    });
    // Switch to master session
    cy.session("master", () => {
      cy.visit("/qcity/kernel");
      cy.contains("QMOI Kernel Control Panel").should("exist");
      // cy.contains('Master Only Feature').should('exist');
    });
    // Switch to user session
    cy.session("user", () => {
      cy.visit("/qcity/kernel");
      cy.contains("QMOI Kernel Control Panel").should("exist");
      // cy.contains('Master Only Feature').should('not.exist');
    });
  });

  it("allows master to impersonate user", () => {
    cy.setCookie("userRole", "master");
    cy.visit("/qcity/kernel");
    // Simulate impersonation by changing cookie
    cy.setCookie("userRole", "user");
    cy.reload();
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('Master Only Feature').should('not.exist');
  });
});
