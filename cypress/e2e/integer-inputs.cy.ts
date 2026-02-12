/// <reference types="cypress" />

/**
 * E2E Integration Tests for JSF - Integer Inputs
 * 
 * These tests validate:
 * - Required integer fields
 * - Range validation (minimum, exclusiveMaximum)
 * - Default values
 */

describe('JSF E2E - Integer Inputs Validations', () => {
  
  beforeEach(() => {
    cy.visit('/');
    cy.waitForJSFForm();
    
    // 1. Navigate to the Integer Inputs tab
    cy.contains('Integer Inputs').click();
    cy.wait(300);
  });

  describe('Required Integer Input', () => {
    
    it('should have a default value (100)', () => {
      // 1. Use direct selector by ID
      cy.get('#integerInputs\\.defaultIntegerInput')
        .should('exist')
        .should('have.value', '100');
    });

    it('should show error when the required field is cleared', () => {
      // 1. Clear the field
      cy.get('#integerInputs\\.defaultIntegerInput')
        .clear()
        .blur();
      
      // 2. Verify that the error is shown
      cy.get('#integerInputs\\.defaultIntegerInput')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when it has an integer value', () => {
      // 1. Enter valid value
      cy.get('#integerInputs\\.defaultIntegerInput')
        .clear()
        .type('250')
        .blur();
      
      // 2. Verify that it is valid
      cy.get('#integerInputs\\.defaultIntegerInput')
        .should('have.class', 'ng-valid');
    });
  });

  describe('Integer Range (5-99)', () => {
    
    it('should show error when the value is less than the minimum (5)', () => {
      // 1. Enter invalid value
      cy.get('#integerInputs\\.integerRange')
        .clear()
        .type('3')
        .blur();
      
      // 2. Verify that the error is shown
      cy.get('#integerInputs\\.integerRange')
        .should('have.class', 'ng-invalid');
    });

    it('should show error when the value is greater than or equal to the exclusive maximum (100)', () => {
      // 1. Enter invalid value
      cy.get('#integerInputs\\.integerRange')
        .clear()
        .type('100')
        .blur();
      
      // 2. Verify that the error is shown
      cy.get('#integerInputs\\.integerRange')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when the value is in the correct range (5-99)', () => {
      // 1. Enter valid value
      cy.get('#integerInputs\\.integerRange')
        .clear()
        .type('50')
        .blur();
      
      // 2. Verify that it is valid
      cy.get('#integerInputs\\.integerRange')
        .should('have.class', 'ng-valid');
    });

    it('should accept the minimum value (5)', () => {
      // 1. Enter minimum value
      cy.get('#integerInputs\\.integerRange')
        .clear()
        .type('5')
        .blur();
      
      // 2. Verify that it is valid
      cy.get('#integerInputs\\.integerRange')
        .should('have.class', 'ng-valid');
    });

    it('should accept the maximum value - 1 (99)', () => {
      // 1. Enter maximum allowed value
      cy.get('#integerInputs\\.integerRange')
        .clear()
        .type('99')
        .blur();
      
      // 2. Verify that it is valid
      cy.get('#integerInputs\\.integerRange')
        .should('have.class', 'ng-valid');
    });
  });

  describe('Read Only Integer Input', () => {
    
    it('should be disabled and not editable', () => {
      // 1. Verify that it exists and is disabled
      cy.get('#integerInputs\\.readonlyIntegerInput')
        .should('exist')
        .should('be.disabled');
    });
  });
});
