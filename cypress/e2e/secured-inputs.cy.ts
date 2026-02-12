/// <reference types="cypress" />

/**
 * E2E Integration Tests for JSF - Secured Text Inputs
 * 
 * These tests validate:
 * - Required secured fields
 * - Optional secured fields
 * - "unset" functionality for optional fields
 */

describe('JSF E2E - Secured Text Inputs Validations', () => {
  
  beforeEach(() => {
    cy.visit('/');
    cy.waitForJSFForm();
    
    // Navegar a la tab de Secured Text Inputs
    cy.contains('Secured Text Inputs').click();
    cy.wait(300);
  });

  describe('Required Secured Text Input', () => {
    
    it('should show error when securedTextInput is empty', () => {
      // 1. Use direct selector by ID
      cy.get('#securedTextInput\\.securedTextInput')
        .clear()
        .blur();
      
      // 2. Verify that the error is shown
      cy.get('#securedTextInput\\.securedTextInput')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when securedTextInput has a value', () => {
      // 1. Enter value
      cy.get('#securedTextInput\\.securedTextInput')
        .clear()
        .type('password123')
        .blur();
      
      // 2. Verify that it is valid
      cy.get('#securedTextInput\\.securedTextInput')
        .should('have.class', 'ng-valid');
    });

    it('should mask the entered text', () => {
      // 1. Enter value
      cy.get('#securedTextInput\\.securedTextInput')
        .type('password123');
      
      // 2. Verify that the input is of type password
      cy.get('#securedTextInput\\.securedTextInput')
        .should('have.attr', 'type', 'password');
    });
  });

  describe('Optional Secured Text Input', () => {
    
    it('should be valid when securedTextInputOptional is empty', () => {
      // 1. Verify that it is valid even when empty
      cy.get('#securedTextInput\\.securedTextInputOptional')
        .clear()
        .blur();
      
      cy.get('#securedTextInput\\.securedTextInputOptional')
        .should('not.have.class', 'ng-invalid');
    });

    it('should be valid when securedTextInputOptional has a value', () => {
      // 1. Enter value
      cy.get('#securedTextInput\\.securedTextInputOptional')
        .clear()
        .type('optional-password')
        .blur();
      
      // 2. Verify that it is valid
      cy.get('#securedTextInput\\.securedTextInputOptional')
        .should('have.class', 'ng-valid');
    });
  });

  describe('Read Only Secured Text Input', () => {
    
    it('should be disabled and not editable', () => {
      // 1. Verify that it exists and is disabled
      cy.get('#securedTextInput\\.readOnlySecuredTextInput')
        .should('exist')
        .should('be.disabled');
    });
  });
});
