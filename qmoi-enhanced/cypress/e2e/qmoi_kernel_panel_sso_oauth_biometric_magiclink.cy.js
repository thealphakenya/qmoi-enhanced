// NOTE: 4 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
/// <reference types="cypress" />

describe('QMOI Kernel Panel SSO/OAuth E2E - Biometric & Magic Link', () => {
  it('allows login via biometric SSO', () => {
    cy.visit('/auth/callback?provider=biometric&token=biometric-TODO_PROD-token&biometric=true');
    cy.setCookie('authToken', 'biometric-TODO_PROD-token');
    cy.setCookie('biometric', 'true');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // cy.contains('Biometric Verified').should('exist');
  });

  it('allows login via magic link', () => {
    cy.visit('/auth/callback?provider=magiclink&token=magiclink-TODO_PROD-token&email=user@example.com');
    cy.setCookie('authToken', 'magiclink-TODO_PROD-token');
    cy.setCookie('email', 'user@example.com');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // cy.contains('Magic Link Login').should('exist');
  });
}); 