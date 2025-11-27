// Minimal Cypress type shim to avoid TS errors in environments where cypress types are not installed.
declare namespace Cypress {
  interface Chainable<Subject = any> {
    visit(url: string): Chainable<null>;
    setCookie(name: string, value: string): Chainable<null>;
    contains(text: string): Chainable<null>;
    intercept(route: any, handler?: any): Chainable<null>;
    wait(alias: string | number): Chainable<null>;
  }
}

declare const cy: Cypress.Chainable<any>;

export {};
