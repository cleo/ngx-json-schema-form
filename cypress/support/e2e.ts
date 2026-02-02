// ***********************************************************
// This support file is processed and loaded automatically before test files.
//
// You can change the location of this file or turn off loading support file
// with the 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to get a form control by its data-test-id
       * @example cy.getByTestId('textInput1')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to wait for the JSF form to be fully loaded
       * @example cy.waitForJSFForm()
       */
      waitForJSFForm(): Chainable<void>;
    }
  }
}

export {};
