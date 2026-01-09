import "./commands";

beforeEach(() => {
  // Clear localStorage before each test
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

afterEach(() => {
  // Logout after each test
  cy.window().then((win) => {
    win.localStorage.removeItem("accessToken");
    win.localStorage.removeItem("refreshToken");
  });
});
