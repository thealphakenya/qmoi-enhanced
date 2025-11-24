describe('Qmoispace Accessibility E2E', () => {
  it('should toggle high contrast mode', () => {
    cy.visit('/');
    cy.contains('Qmoispace').should('exist');
    cy.contains('Accessibility & Device Settings').should('exist');
    cy.get('input[aria-checked=false][type=checkbox]').first().click();
    cy.get('input[aria-checked=true][type=checkbox]').should('exist');
  });
  it('should select inference provider', () => {
    cy.visit('/');
    cy.get('select').select('Local Model');
    cy.get('select').should('have.value', 'local');
  });
}); 