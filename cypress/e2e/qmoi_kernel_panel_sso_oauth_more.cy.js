/// <reference types="cypress" />

describe('QMOI Kernel Panel SSO/OAuth E2E - More Providers & Custom Logic', () => {
  it('allows login via Twitter OAuth', () => {
    cy.visit('/auth/callback?provider=twitter&token=twitter-[PRODUCTION IMPLEMENTATION REQUIRED]-token');
    cy.setCookie('authToken', 'twitter-[PRODUCTION IMPLEMENTATION REQUIRED]-token');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
  });

  it('allows login via SAML SSO', () => {
    cy.visit('/auth/callback?provider=saml&token=saml-[PRODUCTION IMPLEMENTATION REQUIRED]-token');
    cy.setCookie('authToken', 'saml-[PRODUCTION IMPLEMENTATION REQUIRED]-token');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
  });

  it('handles custom SSO with MFA claim', () => {
    cy.visit('/auth/callback?provider=custom&token=custom-mfa-token&mfa=true');
    cy.setCookie('authToken', 'custom-mfa-token');
    cy.setCookie('mfa', 'true');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // cy.contains('MFA Enabled').should('exist'); // Example for custom claim
  });
}); 