/// <reference types="cypress" />

/**
 * Custom command to get elements by data-test-id attribute
 */
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-test-id="${testId}"]`);
});

/**
 * Custom command to wait for JSF form to be fully loaded
 */
Cypress.Commands.add('waitForJSFForm', () => {
  // Wait for the form to be visible
  cy.get('app-root', { timeout: 10000 }).should('be.visible');
  // Wait for Angular to stabilize
  cy.wait(500);
});
