// NOTE: 4 TBD(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
// Cypress E2E test (shimmed types)

describe('QMOI Kernel Panel SSO/OAuth E2E - Multiple Providers', () => {
  it('allows login via Google OAuth', () => {
    const googleToken = 'google-test-token-1';
    cy.intercept('GET', '/api/auth/verify*', (req) => {
      if (req.query && req.query.token === googleToken) {
        req.reply({ statusCode: 200, body: { ok: true, user: { id: 'google-user', role: 'user', name: 'Google User' } } });
      } else {
        req.continue();
      }
    }).as('verifyGoogle');

    cy.visit(`/auth/callback?provider=google&token=${googleToken}`);
    cy.setCookie('authToken', googleToken);
    cy.visit('/qcity/kernel');
    cy.wait('@verifyGoogle');
    cy.contains('QMOI Kernel Control Panel').should('exist');
  });

  it('allows login via GitHub OAuth', () => {
    const ghToken = 'github-test-token-1';
    cy.intercept('GET', '/api/auth/verify*', (req) => {
      if (req.query && req.query.token === ghToken) {
        req.reply({ statusCode: 200, body: { ok: true, user: { id: 'gh-user', role: 'user', name: 'GitHub User' } } });
      } else {
        req.continue();
      }
    }).as('verifyGH');

    cy.visit(`/auth/callback?provider=github&token=${ghToken}`);
    cy.setCookie('authToken', ghToken);
    cy.visit('/qcity/kernel');
    cy.wait('@verifyGH');
    cy.contains('QMOI Kernel Control Panel').should('exist');
  });

  it('shows error on invalid OAuth token', () => {
    const bad = 'invalid-token';
    cy.intercept('GET', '/api/auth/verify*', (req) => {
      req.reply({ statusCode: 401, body: { ok: false, error: 'invalid_token' } });
    }).as('verifyBad');

    cy.visit(`/auth/callback?token=${bad}`);
    cy.setCookie('authToken', bad);
    cy.visit('/qcity/kernel');
    cy.wait('@verifyBad');
    cy.contains('Authentication failed').should('exist');
  });
}); 