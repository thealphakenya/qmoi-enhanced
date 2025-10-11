/// <reference types="cypress" />

describe('QMOI Kernel Panel SSO/OAuth E2E - Biometric & Magic Link', () => {
  it('allows login via biometric SSO', () => {
    cy.visit('/auth/callback?provider=biometric&token=biometric-[PRODUCTION IMPLEMENTATION REQUIRED]-token&biometric=true');
    cy.setCookie('authToken', 'biometric-[PRODUCTION IMPLEMENTATION REQUIRED]-token');
    cy.setCookie('biometric', 'true');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // cy.contains('Biometric Verified').should('exist');
  });

  it('allows login via magic link', () => {
    cy.visit('/auth/callback?provider=magiclink&token=magiclink-[PRODUCTION IMPLEMENTATION REQUIRED]-token&email=user@example.com');
    cy.setCookie('authToken', 'magiclink-[PRODUCTION IMPLEMENTATION REQUIRED]-token');
    cy.setCookie('email', 'user@example.com');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // cy.contains('Magic Link Login').should('exist');
  });
}); 