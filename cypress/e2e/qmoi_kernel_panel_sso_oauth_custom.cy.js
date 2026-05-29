/// <reference types="cypress" />

    cy.visit(
    );
    cy.setCookie(
      "authToken",
    );
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
  });

    cy.visit(
    );
    cy.setCookie(
      "authToken",
    );
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
  });

    cy.visit(
    );
    cy.setCookie(
      "authToken",
    );
    cy.setCookie("userRole", "superuser");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('Superuser Panel').should('exist'); // data for custom claim
  });
});
