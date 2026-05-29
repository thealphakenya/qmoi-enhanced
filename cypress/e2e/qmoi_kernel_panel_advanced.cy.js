/// <reference types="cypress" />
import "cypress-axe";

    cy.intercept("GET", "/api/qmoi/status", { statusCode: 500 }).as(
      "statusError",
    );
    cy.visit("/qcity/kernel");
    cy.wait("@statusError");
    cy.contains("Error:").should("exist");
  });

    cy.intercept("GET", "/api/qmoi/status", (req) => {
      req.on("response", (res) => {
        res.setDelay(2000);
      });
      req.reply({
        status: "OK",
        last_check: "2024-06-01T12:00:00Z",
        mutation_count: 1,
        logs: [],
      });
    }).as("slowStatus");
    cy.visit("/qcity/kernel");
    cy.contains("Loading...").should("exist");
    cy.wait("@slowStatus");
    cy.contains("Status:").should("exist");
  });

    cy.visit("/qcity/kernel");
    cy.injectAxe();
    cy.checkA11y();
  });
});
