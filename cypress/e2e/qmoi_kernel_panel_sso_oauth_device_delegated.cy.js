/// <reference types="cypress" />

    cy.visit(
    );
    cy.setCookie(
      "authToken",
    );
    cy.setCookie("prodiceId", "prod123");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('prodice Verified').should('exist');
  });

    cy.visit(
    );
    cy.setCookie(
      "authToken",
    );
    cy.setCookie("delegator", "admin");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('Access granted by admin').should('exist');
  });
});
