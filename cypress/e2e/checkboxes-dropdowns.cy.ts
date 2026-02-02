/// <reference types="cypress" />

/**
 * E2E Integration Tests for JSF - Checkboxes and Dropdowns
 * 
 * These tests validate:
 * - Simple checkboxes
 * - Checkboxes with children (conditional)
 * - Dropdowns with children
 * - Radio buttons
 */

describe('JSF E2E - Checkboxes and Dropdowns', () => {
  
  beforeEach(() => {
    cy.visit('/');
    cy.waitForJSFForm();
  });

  describe('Simple Checkboxes', () => {
    
    it('should verify that the checkbox exists and can be checked/unchecked', () => {
      // 1. Navigate to Checkboxes tab
      cy.contains('Checkboxes').click();
      cy.wait(300);
      
      // 2. Verify that the element exists
      cy.get('#checkboxes\\.checkbox').should('exist');
      
      // 3. Check the checkbox
      cy.get('#checkboxes\\.checkbox').check();
      cy.get('#checkboxes\\.checkbox').should('be.checked');
      
      // 4. Uncheck the checkbox
      cy.get('#checkboxes\\.checkbox').uncheck();
      cy.get('#checkboxes\\.checkbox').should('not.be.checked');
    });

    it('should have default value in Checkbox with Default', () => {
      // 1. Navigate to Checkboxes tab
      cy.contains('Checkboxes').click();
      cy.wait(300);
      
      // 2. Verify that the checkbox with default is checked by default
      cy.get('#checkboxes\\.defaultCheckbox').should('exist');
      cy.get('#checkboxes\\.defaultCheckbox').should('be.checked');
    });

    it('should verify that Read Only Checkbox is not editable', () => {
      // 1. Navigate to Checkboxes tab
      cy.contains('Checkboxes').click();
      cy.wait(300);
      
      // 2. Verify that it exists and is checked
      cy.get('#checkboxes\\.readOnlyCheckbox').should('exist');
      cy.get('#checkboxes\\.readOnlyCheckbox').should('be.checked');
      // 3. Verify that it is readonly/disabled
      cy.get('#checkboxes\\.readOnlyCheckbox').should('be.disabled');
    });
  });

  describe('Checkboxes with Children', () => {
    
    it('should show children when the checkbox is checked', () => {
      // 1. Navigate to Checkboxes With Children tab
      cy.contains('Checkboxes With Children').click();
      cy.wait(300);
      
      // 2. Verify that it exists and check the checkbox with children
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.value').should('exist');
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.value').check();
      cy.wait(300);
      
      // 3. Verify that the children appear using their ID
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.textInput1').should('be.visible');
    });

    it('should validate required fields in children when the checkbox is checked', () => {
      // 1. Navigate to Checkboxes With Children tab
      cy.contains('Checkboxes With Children').click();
      cy.wait(300);
      
      // 2. Check the checkbox
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.value').should('exist');
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.value').check();
      cy.wait(300);
      
      // 3. Try to leave the required field empty
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.textInput1')
        .clear()
        .blur();
      
      // 4. Verify validation error
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.textInput1')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when the required children field has a value', () => {
      // 1. Navigate to Checkboxes With Children tab
      cy.contains('Checkboxes With Children').click();
      cy.wait(300);
      
      // 2. Check the checkbox
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.value').should('exist');
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.value').check();
      cy.wait(300);
      
      // 3. Fill the required field
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.textInput1')
        .clear()
        .type('Valid value')
        .blur();
      
      // 4. Verify that it is valid
      cy.get('#checkboxesWithChildren\\.checkboxWithChildren1\\.textInput1')
        .should('have.class', 'ng-valid');
    });
  });

  describe('Dropdowns', () => {
    
    it('should be able to select an option from the dropdown', () => {
      // 1. Navigate to Dropdowns & Radio Buttons tab
      cy.contains('Dropdowns & Radio Buttons').click();
      cy.wait(300);
      
      // 2. Verify that it exists and select an option
      cy.get('#enums\\.dropdowns\\.dropdown1').should('exist');
      cy.get('#enums\\.dropdowns\\.dropdown1').select('Option 2');
      cy.get('#enums\\.dropdowns\\.dropdown1').should('have.value', 'option2');
    });

    it('should have default value in Dropdown with Default', () => {
      // 1. Navigate to Dropdowns & Radio Buttons tab
      cy.contains('Dropdowns & Radio Buttons').click();
      cy.wait(300);
      
      // 2. Verify using the direct ID
      cy.get('#enums\\.dropdowns\\.dropdownWithDefault').should('exist');
      cy.get('#enums\\.dropdowns\\.dropdownWithDefault').should('have.value', 'option2');
    });
  });

  describe('Dropdowns with Children', () => {
    
    it('should show different children according to the selected option', () => {
      // 1. Navigate to Dropdowns with Children tab
      cy.contains('Dropdowns with Children').click();
      cy.wait(300);
      
      // 2. Verify that it exists and select Option 1
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1').should('exist');
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1').select('Option 1');
      cy.wait(300);
      
      // 3. Verify that Option 1 children appear (includes the option key)
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1').should('be.visible');
      
      // 4. Change to Option 2
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1').select('Option 2');
      cy.wait(300);
      
      // 5. Verify that Option 2 children appear (includes the option key)
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1\\.option2\\.opt2Child1').should('be.visible');
    });

    it('should validate required fields of children according to the selected option', () => {
      // 1. Navigate to Dropdowns with Children tab
      cy.contains('Dropdowns with Children').click();
      cy.wait(300);
      
      // 2. Select Option 1
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1').should('exist');
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1').select('Option 1');
      cy.wait(300);
      
      // 3. opt1Child1 is required for Option 1 (includes the option key)
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1')
        .clear()
        .blur();
      
      // 4. Verify error
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1')
        .should('have.class', 'ng-invalid');
    });

    it('should be valid when the required children are filled', () => {
      // 1. Navigate to Dropdowns with Children tab
      cy.contains('Dropdowns with Children').click();
      cy.wait(300);
      
      // 2. Select Option 2
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1').should('exist');
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1').select('Option 2');
      cy.wait(300);
      
      // 3. opt2Child2 is required for Option 2 (includes the option key)
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1\\.option2\\.opt2Child2')
        .clear()
        .type('Valid value')
        .blur();
      
      // 4. Verify that it is valid
      cy.get('#dropdownsWithChildren\\.dropdownWithChildren1\\.option2\\.opt2Child2')
        .should('have.class', 'ng-valid');
    });
  });

  describe('Radio Buttons', () => {
    
    it('should be able to select a radio button option', () => {
      // 1. Navigate to Dropdowns & Radio Buttons tab
      cy.contains('Dropdowns & Radio Buttons').click();
      cy.wait(300);
      
      // 2. Select Option 2 using the radio button id
      cy.get('#enums\\.radioButtons\\.radioButton1\\.option2').should('exist');
      cy.get('#enums\\.radioButtons\\.radioButton1\\.option2').check();
      cy.get('#enums\\.radioButtons\\.radioButton1\\.option2').should('be.checked');
    });

    it('should have a default value selected', () => {
      // 1. Navigate to Dropdowns & Radio Buttons tab
      cy.contains('Dropdowns & Radio Buttons').click();
      cy.wait(300);
      
      // 2. Verify default value using the radio button id
      cy.get('#enums\\.radioButtons\\.radioButtonsWithDefault\\.defaultOption2')
        .should('be.checked');
    });

    it('should allow changing the selection', () => {
      // 1. Navigate to Dropdowns & Radio Buttons tab
      cy.contains('Dropdowns & Radio Buttons').click();
      cy.wait(300);
      
      // 2. Verify initial value
      cy.get('#enums\\.radioButtons\\.radioButtonsWithDefault\\.defaultOption2')
        .should('be.checked');
      
      // 3. Change selection
      cy.get('#enums\\.radioButtons\\.radioButtonsWithDefault\\.defaultOption1')
        .check();
      
      cy.get('#enums\\.radioButtons\\.radioButtonsWithDefault\\.defaultOption1')
        .should('be.checked');
    });

    it('should respect the disabled attribute in read only radio buttons', () => {
      // 1. Navigate to Dropdowns & Radio Buttons tab
      cy.contains('Dropdowns & Radio Buttons').click();
      cy.wait(300);
      
      // 2. Verify that the radio buttons are disabled
      cy.get('#enums\\.radioButtons\\.readOnlyRadioButtonsWithDefault\\.defaultOption1')
        .should('exist')
        .should('be.disabled');
      
      cy.get('#enums\\.radioButtons\\.readOnlyRadioButtonsWithDefault\\.defaultOption2')
        .should('be.disabled');
      
      cy.get('#enums\\.radioButtons\\.readOnlyRadioButtonsWithDefault\\.defaultOption3')
        .should('be.disabled');
    });
  });
});
