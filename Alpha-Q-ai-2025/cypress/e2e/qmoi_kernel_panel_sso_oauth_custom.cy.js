/// <reference types="cypress" />

describe('QMOI Kernel Panel SSO/OAuth E2E - Custom Providers', () => {
  it('allows login via Facebook OAuth', () => {
    cy.visit('/auth/callback?provider=facebook&token=facebook-mock-token');
    cy.setCookie('authToken', 'facebook-mock-token');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
  });

  it('allows login via Okta OAuth', () => {
    cy.visit('/auth/callback?provider=okta&token=okta-mock-token');
    cy.setCookie('authToken', 'okta-mock-token');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
  });

  it('handles custom provider with extra claims', () => {
    cy.visit('/auth/callback?provider=custom&token=custom-mock-token&role=superuser');
    cy.setCookie('authToken', 'custom-mock-token');
    cy.setCookie('userRole', 'superuser');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // cy.contains('Superuser Panel').should('exist'); // Example for custom claim
  });
}); 