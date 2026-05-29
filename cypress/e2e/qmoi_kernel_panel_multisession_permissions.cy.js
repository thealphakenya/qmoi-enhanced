/// <reference types="cypress" />

    // Admin session
    cy.setCookie("userRole", "admin");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // data: check for admin-only feature
    // cy.contains('Admin Only Feature').should('exist');

    // Switch to user session
    cy.clearCookies();
    cy.setCookie("userRole", "user");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('Admin Only Feature').should('not.exist');
  });

  // If using Cypress 10+ with cy.session:
  //   cy.session('admin', () => {
  //     cy.setCookie('userRole', 'admin');
  //   });
  //   cy.session('user', () => {
  //     cy.setCookie('userRole', 'user');
  //   });
  //   cy.visit('/qcity/kernel');
  //   // ...assertions...
  // });
});
