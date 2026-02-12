/// <reference types="cypress" />

/**
 * E2E Integration Tests for JSF - Text Inputs
 *
 * These tests validate:
 * - minLength and maxLength validation
 * - Email format validation
 * - URL format validation
 * - Pattern validation (phone number)
 * - Required fields (textarea)
 */

describe('JSF E2E - Text Inputs Validations', () => {
  
  beforeEach(() => {
    // 1. Visit the application
    cy.visit('/');
    
    // 2. Wait for the JSF form to load
    cy.waitForJSFForm();
    
    // 3. Navigate to the Text Inputs tab
    cy.contains('Text Inputs').click();
    cy.wait(300);
  });

  describe('minLength and maxLength Validation', () => {
    
    it('should show error when textInput1 has less than 3 characters (minLength)', () => {
      // 1. Use direct ID with escaped dot
      cy.get('#textInputs\\.textInput1')
        .should('exist')
        .clear()
        .type('ab')
        .blur();
      
      // 2. Verify that the input has ng-invalid class
      cy.get('#textInputs\\.textInput1')
        .should('have.class', 'ng-invalid');
    });

    it('should show error when textInput1 has more than 9 characters (maxLength)', () => {
      // 1. Type more than maximum length
      cy.get('#textInputs\\.textInput1')
        .should('exist')
        .clear()
        .type('1234567890')
        .blur();
      
      // 2. Verify that the input has ng-invalid class
      cy.get('#textInputs\\.textInput1')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when textInput1 has between 3 and 9 characters', () => {
      // 1. Type valid length value
      cy.get('#textInputs\\.textInput1')
        .should('exist')
        .clear()
        .type('valid')
        .blur();
      
      // 2. Verify that the input has ng-valid class
      cy.get('#textInputs\\.textInput1')
        .should('have.class', 'ng-valid');
    });
  });

  describe('Email Format Validation', () => {
    
    it('should show error when emailTextInput has invalid format', () => {
      // 1. Type invalid email
      cy.get('#textInputs\\.emailTextInput')
        .should('exist')
        .clear()
        .type('invalid-email')
        .blur();
      
      // 2. Verify that the input has ng-invalid class
      cy.get('#textInputs\\.emailTextInput')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when emailTextInput has correct format', () => {
      // 1. Type valid email
      cy.get('#textInputs\\.emailTextInput')
        .should('exist')
        .clear()
        .type('user@example.com')
        .blur();
      
      // 2. Verify that the input has ng-valid class
      cy.get('#textInputs\\.emailTextInput')
        .should('have.class', 'ng-valid');
    });
  });

  describe('URL Format Validation', () => {
    
    it('should show error when urlTextInput has invalid format', () => {
      // 1. Type invalid URL
      cy.get('#textInputs\\.urlTextInput')
        .should('exist')
        .clear()
        .type('invalid-url')
        .blur();
      
      // 2. Verify that the input has ng-invalid class
      cy.get('#textInputs\\.urlTextInput')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when urlTextInput has correct format', () => {
      // 1. Type valid URL
      cy.get('#textInputs\\.urlTextInput')
        .should('exist')
        .clear()
        .type('https://www.example.com')
        .blur();
      
      // 2. Verify that the input has ng-valid class
      cy.get('#textInputs\\.urlTextInput')
        .should('have.class', 'ng-valid');
    });
  });

  describe('Pattern Validation (Phone)', () => {
    
    it('should show error when patternTextInput does not match the pattern', () => {
      // 1. Type invalid pattern
      cy.get('#textInputs\\.patternTextInput')
        .should('exist')
        .clear()
        .type('123456')
        .blur();
      
      // 2. Verify that the input has ng-invalid class
      cy.get('#textInputs\\.patternTextInput')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when patternTextInput matches the pattern (###)###-####', () => {
      // 1. Type valid pattern with parentheses
      cy.get('#textInputs\\.patternTextInput')
        .should('exist')
        .clear()
        .type('(555)123-4567')
        .blur();
      
      // 2. Verify that the input has ng-valid class
      cy.get('#textInputs\\.patternTextInput')
        .should('have.class', 'ng-valid');
    });

    it('should be valid with alternative format ###-####', () => {
      // 1. Type valid pattern without parentheses
      cy.get('#textInputs\\.patternTextInput')
        .should('exist')
        .clear()
        .type('555-1234')
        .blur();
      
      // 2. Verify that the input has ng-valid class
      cy.get('#textInputs\\.patternTextInput')
        .should('have.class', 'ng-valid');
    });
  });

  describe('Required Field Validation (TextArea)', () => {
    
    it('should show error when textAreaInput is empty', () => {
      // 1. Clear the textarea
      cy.get('#textInputs\\.textAreaInput')
        .should('exist')
        .clear()
        .blur();
      
      // 2. Verify that the textarea has ng-invalid class (required)
      cy.get('#textInputs\\.textAreaInput')
        .should('have.class', 'ng-invalid');
    });

    it('should accept content when textAreaInput receives text', () => {
      // 1. Type content in textarea
      cy.get('#textInputs\\.textAreaInput')
        .should('exist')
        .clear()
        .type('Test content for the textarea')
        .blur();
      
      // 2. Verify that the textarea displays the entered content
      cy.get('#textInputs\\.textAreaInput')
        .should('have.value', 'Test content for the textarea');
    });
  });
});
