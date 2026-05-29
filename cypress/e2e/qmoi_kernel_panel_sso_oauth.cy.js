/// <reference types="cypress" />

    cy.visit(
    );
    cy.setCookie(
      "authToken",
    );
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // Add more assertions for user info, roles, etc. as needed
  });
});
