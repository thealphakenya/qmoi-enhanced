/// <reference types="cypress" />
import 'cypress-axe';

describe('QMOI Kernel Panel Multi-User & Mobile E2E', () => {
  beforeEach(() => {
    // Default to regular user
    cy.clearCookies();
    cy.setCookie('userRole', 'user');
  });

  it('shows admin panel for admin user', () => {
    cy.setCookie('userRole', 'admin');
    cy.visit('/qcity/kernel');
    // Example: check for admin-only UI
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // You can add more admin-specific checks here
  });

  it('shows limited UI for regular user', () => {
    cy.setCookie('userRole', 'user');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('exist');
    // Example: check that admin-only features are not visible
    // cy.contains('Admin Only Feature').should('not.exist');
  });

  it('renders correctly on mobile viewport', () => {
    cy.viewport('iphone-6');
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel').should('be.visible');
    // Add more mobile-specific assertions as needed
  });

  it('has no major accessibility violations on mobile', () => {
    cy.viewport('iphone-6');
    cy.visit('/qcity/kernel');
    cy.injectAxe();
    cy.checkA11y();
  });
}); 