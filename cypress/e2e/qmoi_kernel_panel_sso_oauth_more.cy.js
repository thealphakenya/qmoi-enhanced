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

    cy.visit("/auth/callback?provider=custom&token=custom-mfa-token&mfa=true");
    cy.setCookie("authToken", "custom-mfa-token");
    cy.setCookie("mfa", "true");
    cy.visit("/qcity/kernel");
    cy.contains("QMOI Kernel Control Panel").should("exist");
    // cy.contains('MFA Enabled').should('exist'); // data for custom claim
  });
});
