/// <reference types="cypress" />

describe('QMOI Kernel Panel SSO/OAuth E2E', () => {
  it('allows login via OAuth and shows panel', () => {
    // Simulate OAuth callback with a mock token
    cy.visit('/auth/callback?token=mock-oauth-token');
    cy.setCookie('authToken', 'mock-oauth-token');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // Add more assertions for user info, roles, etc. as needed
  });
}); 