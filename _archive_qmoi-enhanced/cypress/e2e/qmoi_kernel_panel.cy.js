describe('QMOI Kernel Panel E2E', () => {
  it('shows status and runs QFix', () => {
    cy.visit('/qcity/kernel');
    cy.contains('QMOI Kernel Control Panel');
    cy.contains('Status:').should('exist');
    cy.contains('Run QFix').click();
    cy.contains('Last Action:').should('exist');
  });
}); 