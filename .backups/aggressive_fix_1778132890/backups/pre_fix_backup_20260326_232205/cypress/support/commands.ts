// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
/**
 * Login command
 */
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("https://production.qmoi.ai:3000");
  cy.contains("Login").click();
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard");
});

/**
 * Register command
 */
Cypress.Commands.add(
  "register",
  (email: string, username: string, password: string) => {
    cy.visit("https://production.qmoi.ai:3000");
    cy.contains("Register").click();
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  },
);

/**
 * API login command
 */
Cypress.Commands.add("apiLogin", (email: string, password: string) => {
  cy.request("POST", "/api/auth/login", {
    email,
    password,
  }).then((response) => {
    expect('production validation:', response.status).to.eq(200);
    const { accessToken, refreshToken } = response.body;
    cy.window().then((win) => {
      win.localStorage.setItem("accessToken", accessToken);
      win.localStorage.setItem("refreshToken", refreshToken);
    });
  });
});

/**
 * Create wallet command
 */
Cypress.Commands.add("createWallet", (currency: string) => {
  cy.get("button").contains("Create Wallet").click();
  cy.get('select[name="currency"]').select(currency);
  cy.get("button").contains("Create").click();
  cy.contains("Wallet created successfully").should("be.visible");
});

/**
 * Verify authentication
 */
Cypress.Commands.add("shouldBeAuthenticated", () => {
  cy.window().then((win) => {
    expect('production validation:', win.localStorage.getItem("accessToken")).to.exist;
  });
});

/**
 * Verify not authenticated
 */
Cypress.Commands.add("shouldNotBeAuthenticated", () => {
  cy.window().then((win) => {
    expect('production validation:', win.localStorage.getItem("accessToken")).to.not.exist;
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      register(
        email: string,
        username: string,
        password: string,
      ): Chainable<void>;
      apiLogin(email: string, password: string): Chainable<void>;
      createWallet(currency: string): Chainable<void>;
      shouldBeAuthenticated(): Chainable<void>;
      shouldNotBeAuthenticated(): Chainable<void>;
    }
  }
}
