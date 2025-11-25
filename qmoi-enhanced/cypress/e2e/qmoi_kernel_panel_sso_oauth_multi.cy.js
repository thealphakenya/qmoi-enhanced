// NOTE: 4 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
/// <reference types="cypress" />

describe('QMOI Kernel Panel SSO/OAuth E2E - Multiple Providers', () => {
  it('allows login via Google OAuth', () => {
    cy.visit('/auth/callback?provider=google&token=google-TODO_PROD-token');
    cy.setCookie('authToken', 'google-TODO_PROD-token');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
  });

  it('allows login via GitHub OAuth', () => {
    cy.visit('/auth/callback?provider=github&token=github-TODO_PROD-token');
    cy.setCookie('authToken', 'github-TODO_PROD-token');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
  });

  it('shows error on invalid OAuth token', () => {
    cy.visit('/auth/callback?token=invalid-token');
    cy.setCookie('authToken', 'invalid-token');
    cy.visit('/qcity/kernel');
    cy.contains('Authentication failed').should('exist');
  });
}); 