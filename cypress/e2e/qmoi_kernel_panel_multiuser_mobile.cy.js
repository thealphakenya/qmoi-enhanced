/// <reference types="cypress" />
import "cypress-axe";

  beforeEach(() => {
    // Default to regular user
    cy.clearCookies();
    cy.setCookie("userRole", "user");
  });

    cy.setCookie("userRole", "admin");
    cy.visit("/qcity/kernel");
    // data: check for admin-only UI
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // You can add more admin-specific checks here
  });

    cy.setCookie("userRole", "user");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // data: check that admin-only features are not visible
    // cy.contains('Admin Only Feature').should('not.exist');
  });

    cy.viewport("iphone-6");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("be.visible");
    // Add more mobile-specific assertions as needed
  });

    cy.viewport("iphone-6");
    cy.visit("/qcity/kernel");
    cy.injectAxe();
    cy.checkA11y();
  });
});
