/// <reference types="cypress" />

    cy.visit(
    );
    cy.setCookie(
      "authToken",
    );
    cy.setCookie("biometric", "true");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('Biometric Verified').should('exist');
  });

    cy.visit(
    );
    cy.setCookie(
      "authToken",
    );
    cy.setCookie("email", "user@data.com");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('Magic Link Login').should('exist');
  });
});
