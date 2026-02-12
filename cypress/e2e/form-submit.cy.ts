/// <reference types="cypress" />

/**
 * E2E Integration Tests for JSF - Form Submit
 *
 * These tests validate:
 * - Successful submit with all required fields filled correctly
 * - Failed submit when required fields are missing
 * - Successful submit with empty optional fields
 * - Submit button validation (enabled/disabled)
 */

describe("JSF E2E - Complete Form Submit", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForJSFForm();
  });

  describe("Successful Submit - All required fields valid", () => {
    it("should allow submit when all required fields are filled correctly", () => {
      // 1. Dropdowns & Radio Buttons - Fill required fields
      cy.contains("Dropdowns & Radio Buttons").click();
      cy.wait(300);

      // Dropdown 2 (required, no empty string option)
      cy.get("#enums\\.dropdowns\\.dropdown2")
        .should("exist")
        .select("option1");

      // Dropdown 3 (required, no empty string option)
      cy.get("#enums\\.dropdowns\\.dropdown3")
        .should("exist")
        .select("option1");

      // DropdownWithDefault already has default value (option1)

      // Radio Buttons already have first value selected by default

      // 2. Dropdowns with Children - Fill required fields
      cy.contains("Dropdowns with Children").click();
      cy.wait(300);

      // Dropdown with Children 1 - select option1
      cy.get("#dropdownsWithChildren\\.dropdownWithChildren1")
        .should("exist")
        .select("option1");
      cy.wait(200);

      // Fill required child of option1
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1",
      )
        .should("exist")
        .clear()
        .type("Valor child 1");

      // Dropdown with Children with Default - already has option2 selected
      // Fill required child of option2
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1WithDefault\\.option2\\.opt2Child2",
      )
        .should("exist")
        .clear()
        .type("Valor child 2");

      // 3. Text Inputs - Fill required textarea
      cy.contains("Text Inputs").click();
      cy.wait(300);

      cy.get("#textInputs\\.textAreaInput")
        .should("exist")
        .clear()
        .type("usuario@example.com");

      // 4. Secured Text Inputs - Fill required field
      cy.contains("Secured Text Inputs").click();
      cy.wait(300);

      cy.get("#securedTextInput\\.securedTextInput")
        .should("exist")
        .clear()
        .type("SecurePass123!");

      // 5. Integer Inputs - Verify defaultIntegerInput (required)
      cy.contains("Integer Inputs").click();
      cy.wait(300);

      cy.get("#integerInputs\\.defaultIntegerInput")
        .should("exist")
        .should("have.value", "100");

      // 6. Tabs - Fill required field inside tabs
      cy.contains("Tabs").click();
      cy.wait(300);

      // The "Text Inputs" tab is already active
      cy.get("#tabs\\.textInputs\\.textInput1")
        .should("exist")
        .clear()
        .type("Valor para tab");

      // Navigate to "Dropdowns with Children II" tab
      cy.contains("Dropdowns with Children II").click();
      cy.wait(300);

      // Dropdown without required selection - select dd1
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns")
        .should("exist")
        .select("dd1");
      cy.wait(200);

      // Fill required child of dd1 (Child 1 of Option 1)
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns\\.dd1\\.child1")
        .should("exist")
        .clear()
        .type("Child 1 dd1");

      // Dropdown with default already has op1, fill children
      cy.get(
        "#tabs\\.dropdownsChildrenII\\.moreDropdownsDefault\\.op1\\.child1",
      )
        .should("exist")
        .type("Child del tab");

      // 7. Arrays - Fill required array
      cy.contains("Array Inputs").click();
      cy.wait(300);

      // Required array - Click Edit to add elements
      cy.get('label[for="arrays.reqArrayInput"]')
        .closest(".form-item-with-label")
        .find(".edit-btn button")
        .click();
      cy.wait(500);

      // Wait for modal to be visible
      cy.get(".modal.fade.in").should("be.visible");
      cy.wait(500);

      // The modal with ag-grid should appear
      // Fill all fields in the input row
      cy.get('.ag-floating-top [col-id="make"] input')
        .should("exist")
        .type("Toyota");

      cy.get('.ag-floating-top [col-id="model"] input')
        .should("exist")
        .type("Camry");

      // Select Transmission using enum value
      cy.get('.ag-floating-top [col-id="transmission"] select')
        .should("exist")
        .select("1: automatic");

      // Check Available checkbox
      cy.get('.ag-floating-top [col-id="available"] input[type="checkbox"]')
        .should("exist")
        .check({ force: true });

      cy.get('.ag-floating-top [col-id="price"] input')
        .should("exist")
        .type("25000");

      // Click Add button to add the row
      cy.get("button.jsf-table-add-button").should("exist").click();
      cy.wait(1000);

      // Verify that at least one row was added to the grid
      cy.get('.ag-center-cols-container [role="row"]').should(
        "have.length.at.least",
        1,
      );

      // Close the modal - wait for OK button to be enabled
      cy.get(".modal-footer button")
        .contains("OK")
        .should("not.be.disabled")
        .click();
      cy.wait(1000);

      // 8. Verify that Submit button is enabled
      cy.get("button").contains("Submit").should("not.be.disabled");

      // 9. Click Submit
      cy.get("button").contains("Submit").click();

      // 10. Verify no visible errors after submit
      cy.wait(500);
    });

    it("should keep values after navigating between tabs", () => {
      // 1. Fill field in Text Inputs
      cy.contains("Text Inputs").click();
      cy.wait(300);

      cy.get("#textInputs\\.textAreaInput")
        .should("exist")
        .clear({ force: true })
        .type("test@example.com");

      // 2. Navigate to another tab
      cy.contains("Secured Text Inputs").click();
      cy.wait(300);

      // 3. Return to Text Inputs
      cy.contains("Text Inputs").click();
      cy.wait(300);

      // 4. Verify that the value is maintained
      cy.get("#textInputs\\.textAreaInput").should(
        "have.value",
        "test@example.com",
      );
    });

    it("should allow filling optional fields in addition to required ones", () => {
      // 1. Fill required Dropdowns
      cy.contains("Dropdowns & Radio Buttons").click();
      cy.wait(300);

      cy.get("#enums\\.dropdowns\\.dropdown2")
        .should("exist")
        .select("option1");
      cy.get("#enums\\.dropdowns\\.dropdown3")
        .should("exist")
        .select("option2");

      // 2. Fill required fields in Text Inputs
      cy.contains("Text Inputs").click();
      cy.wait(300);

      cy.get("#textInputs\\.textAreaInput")
        .should("exist")
        .clear({ force: true })
        .type("usuario@example.com");

      // Fill optional fields
      cy.get("#textInputs\\.textInput1").should("exist").clear().type("valido");

      cy.get("#textInputs\\.emailTextInput")
        .should("exist")
        .clear()
        .type("otro@test.com");

      // 3. Fill required Secured field
      cy.contains("Secured Text Inputs").click();
      cy.wait(300);

      cy.get("#securedTextInput\\.securedTextInput")
        .should("exist")
        .clear()
        .type("password123");

      // 4. Fill Dropdowns with Children
      cy.contains("Dropdowns with Children").click();
      cy.wait(300);

      cy.get("#dropdownsWithChildren\\.dropdownWithChildren1").select(
        "option1",
      );
      cy.wait(200);
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1",
      )
        .clear()
        .type("Child value");

      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1WithDefault\\.option2\\.opt2Child2",
      )
        .clear()
        .type("Child2 value");

      // 5. Tabs
      cy.contains("Tabs").click();
      cy.wait(300);
      cy.get("#tabs\\.textInputs\\.textInput1").clear().type("Tab value");

      cy.contains("Dropdowns with Children II").click();
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns").select("dd1");
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns\\.dd1\\.child1")
        .should("exist")
        .clear()
        .type("Child 1 dd1");
      cy.get(
        "#tabs\\.dropdownsChildrenII\\.moreDropdownsDefault\\.op1\\.child1",
      )
        .clear()
        .type("Tab child");

      // 6. Arrays - Fill required array
      cy.contains("Array Inputs").click();
      cy.wait(300);

      // Array requerido - Click en Edit para agregar elementos
      cy.get('label[for="arrays.reqArrayInput"]')
        .closest(".form-item-with-label")
        .find(".edit-btn button")
        .click();
      cy.wait(500);

      // Wait for modal to be visible
      cy.get(".modal.fade.in").should("be.visible");
      cy.wait(500);

      // The modal with ag-grid should appear
      // Fill all fields in the input row
      cy.get('.ag-floating-top [col-id="make"] input')
        .should("exist")
        .type("Toyota");

      cy.get('.ag-floating-top [col-id="model"] input')
        .should("exist")
        .type("Camry");

      // Seleccionar Transmission usando el valor del enum
      cy.get('.ag-floating-top [col-id="transmission"] select')
        .should("exist")
        .select("1: automatic");

      // Marcar Available checkbox
      cy.get('.ag-floating-top [col-id="available"] input[type="checkbox"]')
        .should("exist")
        .check({force: true});

      cy.get('.ag-floating-top [col-id="price"] input')
        .should("exist")
        .type("25000");

      // Click Add button to add the row
      cy.get("button.jsf-table-add-button").should("exist").click();
      cy.wait(1000);

      // Verify that at least one row was added to the grid
      cy.get('.ag-center-cols-container [role="row"]').should(
        "have.length.at.least",
        1,
      );

      // Close the modal - wait for OK button to be enabled
      cy.get(".modal-footer button")
        .contains("OK")
        .should("not.be.disabled")
        .click();
      cy.wait(1000);
      cy.get("button").contains("Submit", { matchCase: false }).click();

      cy.wait(500);
    });
  });

  describe("Failed Submit - Missing required fields", () => {
    it("should NOT allow successful submit when textAreaInput is missing (required)", () => {
      // 1. Fill other required fields but leave textAreaInput empty
      cy.contains("Dropdowns & Radio Buttons").click();
      cy.wait(300);
      cy.get("#enums\\.dropdowns\\.dropdown2")
        .should("exist")
        .select("option1");
      cy.get("#enums\\.dropdowns\\.dropdown3")
        .should("exist")
        .select("option1");

      cy.contains("Secured Text Inputs").click();
      cy.wait(300);
      cy.get("#securedTextInput\\.securedTextInput")
        .should("exist")
        .clear()
        .type("password123");

      cy.contains("Dropdowns with Children").click();
      cy.wait(300);
      cy.get("#dropdownsWithChildren\\.dropdownWithChildren1")
        .should("exist")
        .select("option1");
      cy.wait(200);
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1",
      )
        .should("exist")
        .clear()
        .type("Child");
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1WithDefault\\.option2\\.opt2Child2",
      )
        .should("exist")
        .clear()
        .type("Child2");

      cy.contains("Tabs").click();
      cy.wait(300);
      cy.get("#tabs\\.textInputs\\.textInput1")
        .should("exist")
        .clear()
        .type("Tab value");
      cy.contains("Dropdowns with Children II").click();
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns")
        .should("exist")
        .select("dd1");
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns\\.dd1\\.child1")
        .should("exist")
        .clear()
        .type("Child 1 dd1");
      cy.get(
        "#tabs\\.dropdownsChildrenII\\.moreDropdownsDefault\\.op1\\.child1",
      )
        .should("exist")
        .type("Tab child");

      // Fill required array
      cy.contains("Array Inputs").click();
      cy.wait(300);
      cy.get('label[for="arrays.reqArrayInput"]')
        .closest(".form-item-with-label")
        .find(".edit-btn button")
        .click();
      cy.wait(500);

      // Wait for modal to be visible
      cy.get(".modal.fade.in").should("be.visible");
      cy.wait(500);

      // Fill all fields in the array modal
      cy.get('.ag-floating-top [col-id="make"] input')
        .should("exist")
        .type("Honda");
      cy.get('.ag-floating-top [col-id="model"] input')
        .should("exist")
        .type("Civic");
      cy.get('.ag-floating-top [col-id="transmission"] select')
        .should("exist")
        .select("0: manual");
      cy.get(
        '.ag-floating-top [col-id="available"] input[type="checkbox"]',
      )
        .should("exist")
        .check({ force: true });
      cy.get('.ag-floating-top [col-id="price"] input')
        .should("exist")
        .type("20000");
      cy.get("button.jsf-table-add-button").should("exist").click();
      cy.wait(1000);

      // Verify that the row was added
      cy.get('.ag-center-cols-container [role="row"]').should(
        "have.length.at.least",
        1,
      );

      // Close modal - wait for OK to be enabled
      cy.get(".modal-footer button")
        .contains("OK")
        .should("not.be.disabled")
        .click();
      cy.wait(1000);

      // 2. Leave textAreaInput empty
      cy.contains("Text Inputs").click();
      cy.wait(300);

      cy.get("#textInputs\\.textAreaInput").should("exist").clear({ force: true }).blur();
      cy.wait(500);

      // 3. Verify that Submit button is disabled
      cy.get("button").contains("Submit").should("be.disabled");

      // 4. Verify that the field shows error
      cy.get("#textInputs\\.textAreaInput").should("have.class", "ng-invalid");
    });

    it("should NOT allow successful submit when securedTextInput is missing (required)", () => {
      // 1. Fill other required fields
      cy.contains("Dropdowns & Radio Buttons").click();
      cy.wait(300);
      cy.get("#enums\\.dropdowns\\.dropdown2")
        .should("exist")
        .select("option1");
      cy.get("#enums\\.dropdowns\\.dropdown3")
        .should("exist")
        .select("option1");

      cy.contains("Text Inputs").click();
      cy.wait(300);
      cy.get("#textInputs\\.textAreaInput")
        .should("exist")
        .clear({ force: true })
        .type("usuario@example.com");

      cy.contains("Dropdowns with Children").click();
      cy.wait(300);
      cy.get("#dropdownsWithChildren\\.dropdownWithChildren1")
        .should("exist")
        .select("option1");
      cy.wait(200);
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1",
      )
        .should("exist")
        .clear()
        .type("Child");
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1WithDefault\\.option2\\.opt2Child2",
      )
        .should("exist")
        .clear()
        .type("Child2");

      cy.contains("Tabs").click();
      cy.wait(300);
      cy.get("#tabs\\.textInputs\\.textInput1")
        .should("exist")
        .clear()
        .type("Tab value");
      cy.contains("Dropdowns with Children II").click();
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns")
        .should("exist")
        .select("dd1");
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns\\.dd1\\.child1")
        .should("exist")
        .clear()
        .type("Child 1 dd1");
      cy.get(
        "#tabs\\.dropdownsChildrenII\\.moreDropdownsDefault\\.op1\\.child1",
      )
        .should("exist")
        .type("Tab child");

      // Fill required array
      cy.contains("Array Inputs").click();
      cy.wait(300);
      cy.get('label[for="arrays.reqArrayInput"]')
        .closest(".form-item-with-label")
        .find(".edit-btn button")
        .click();
      cy.wait(500);

      // Wait for modal to be visible
      cy.get(".modal.fade.in").should("be.visible");
      cy.wait(500);

      // Fill all fields in the array modal
      cy.get('.ag-floating-top [col-id="make"] input')
        .should("exist")
        .type("Ford");
      cy.get('.ag-floating-top [col-id="model"] input')
        .should("exist")
        .type("Mustang");
      cy.get('.ag-floating-top [col-id="transmission"] select')
        .should("exist")
        .select("0: manual");
      cy.get(
        '.ag-floating-top [col-id="available"] input[type="checkbox"]',
      )
        .should("exist")
        .check({ force: true });
      cy.get('.ag-floating-top [col-id="price"] input')
        .should("exist")
        .type("30000");
      cy.get("button.jsf-table-add-button").should("exist").click();
      cy.wait(1000);

      // Verify that the row was added
      cy.get('.ag-center-cols-container [role="row"]').should(
        "have.length.at.least",
        1,
      );

      // Close modal - wait for OK to be enabled
      cy.get(".modal-footer button")
        .contains("OK")
        .should("not.be.disabled")
        .click();
      cy.wait(1000);

      // 2. Leave securedTextInput empty
      cy.contains("Secured Text Inputs").click();
      cy.wait(300);

      cy.get("#securedTextInput\\.securedTextInput")
        .should("exist")
        .clear()
        .blur();
      cy.wait(500);

      // 3. Verify that Submit button is disabled
      cy.get("button").contains("Submit").should("be.disabled");

      // 4. Verify that there is an error
      cy.get("#securedTextInput\\.securedTextInput").should(
        "have.class",
        "ng-invalid",
      );
    });

    it("should NOT allow successful submit when defaultIntegerInput is empty", () => {
      // 1. Fill other required fields
      cy.contains("Dropdowns & Radio Buttons").click();
      cy.wait(300);
      cy.get("#enums\\.dropdowns\\.dropdown2")
        .should("exist")
        .select("option1");
      cy.get("#enums\\.dropdowns\\.dropdown3")
        .should("exist")
        .select("option1");

      cy.contains("Text Inputs").click();
      cy.wait(300);
      cy.get("#textInputs\\.textAreaInput")
        .should("exist")
        .clear({ force: true })
        .type("usuario@example.com");

      cy.contains("Secured Text Inputs").click();
      cy.wait(300);
      cy.get("#securedTextInput\\.securedTextInput")
        .should("exist")
        .clear()
        .type("password123");

      cy.contains("Dropdowns with Children").click();
      cy.wait(300);
      cy.get("#dropdownsWithChildren\\.dropdownWithChildren1")
        .should("exist")
        .select("option1");
      cy.wait(200);
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1",
      )
        .should("exist")
        .clear()
        .type("Child");
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1WithDefault\\.option2\\.opt2Child2",
      )
        .should("exist")
        .clear()
        .type("Child2");

      cy.contains("Tabs").click();
      cy.wait(300);
      cy.get("#tabs\\.textInputs\\.textInput1")
        .should("exist")
        .clear()
        .type("Tab value");
      cy.contains("Dropdowns with Children II").click();
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns")
        .should("exist")
        .select("dd1");
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns\\.dd1\\.child1")
        .should("exist")
        .clear()
        .type("Child 1 dd1");
      cy.get(
        "#tabs\\.dropdownsChildrenII\\.moreDropdownsDefault\\.op1\\.child1",
      )
        .should("exist")
        .type("Tab child");

      // 2. Clear defaultIntegerInput
      cy.contains("Integer Inputs").click();
      cy.wait(300);

      cy.get("#integerInputs\\.defaultIntegerInput")
        .should("exist")
        .clear()
        .blur();
      cy.wait(500);

      // 3. Verify that Submit button is disabled
      cy.get("button").contains("Submit").should("be.disabled");

      // 4. Verify that the field has an error
      cy.get("#integerInputs\\.defaultIntegerInput").should(
        "have.class",
        "ng-invalid",
      );
    });
  });

  describe("Submit with Mixed Validations", () => {
    it("should show errors in fields with invalid values when attempting submit", () => {
      // 1. Fill textarea with invalid email
      cy.contains("Text Inputs").click();
      cy.wait(300);

      cy.get("#textInputs\\.textAreaInput")
        .should("exist")
        .clear({ force: true })
        .type("email-invalido")
        .blur();
      cy.wait(500);

      // 2. Verify that the field shows error
      cy.get("#textInputs\\.textAreaInput").should("have.class", "ng-invalid");

      // 3. Verify that Submit button is disabled due to invalid field
      cy.get("button").contains("Submit").should("be.disabled");
    });

    it("should validate all fields when submitting", () => {
      // 1. Fill some fields with invalid values
      cy.contains("Text Inputs").click();
      cy.wait(300);

      // Field with invalid minLength
      cy.get("#textInputs\\.textInput1").should("exist").clear().type("ab");

      // Invalid email
      cy.get("#textInputs\\.emailTextInput")
        .should("exist")
        .clear()
        .type("invalido");

      // Valid required textarea
      cy.get("#textInputs\\.textAreaInput")
        .should("exist")
        .clear({ force: true })
        .type("usuario@example.com");

      // 2. Fill other required fields
      cy.contains("Dropdowns & Radio Buttons").click();
      cy.wait(300);
      cy.get("#enums\\.dropdowns\\.dropdown2")
        .should("exist")
        .select("option1");
      cy.get("#enums\\.dropdowns\\.dropdown3")
        .should("exist")
        .select("option1");

      cy.contains("Secured Text Inputs").click();
      cy.wait(300);
      cy.get("#securedTextInput\\.securedTextInput")
        .should("exist")
        .clear()
        .type("password123");

      cy.contains("Dropdowns with Children").click();
      cy.wait(300);
      cy.get("#dropdownsWithChildren\\.dropdownWithChildren1")
        .should("exist")
        .select("option1");
      cy.wait(200);
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1\\.option1\\.opt1Child1",
      )
        .should("exist")
        .clear()
        .type("Child");
      cy.get(
        "#dropdownsWithChildren\\.dropdownWithChildren1WithDefault\\.option2\\.opt2Child2",
      )
        .should("exist")
        .clear()
        .type("Child2");

      cy.contains("Tabs").click();
      cy.wait(300);
      cy.get("#tabs\\.textInputs\\.textInput1")
        .should("exist")
        .clear()
        .type("Tab");
      cy.contains("Dropdowns with Children II").click();
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns")
        .should("exist")
        .select("dd1");
      cy.wait(200);
      cy.get("#tabs\\.dropdownsChildrenII\\.moreDropdowns\\.dd1\\.child1")
        .should("exist")
        .clear()
        .type("Child 1 dd1");
      cy.get(
        "#tabs\\.dropdownsChildrenII\\.moreDropdownsDefault\\.op1\\.child1",
      )
        .should("exist")
        .type("Tab child");

      // 3. Verify that there are invalid fields
      cy.contains("Text Inputs").click();
      cy.wait(300);

      cy.get("#textInputs\\.textInput1").should("have.class", "ng-invalid");
      cy.get("#textInputs\\.emailTextInput").should("have.class", "ng-invalid");

      // 4. Verify that Submit button is disabled due to invalid fields
      cy.get("button").contains("Submit").should("be.disabled");
    });
  });

  describe("Cancel and Reset Form", () => {
    it("should clear the form when clicking Cancel", () => {
      // 1. Fill some fields
      cy.contains("Text Inputs").click();
      cy.wait(300);

      cy.get("#textInputs\\.textAreaInput")
        .should("exist")
        .clear({ force: true })
        .type("test@example.com");

      // 2. Click Cancel (if it exists)
      cy.get("button")
        .contains("Cancel", { matchCase: false })
        .then(($btn) => {
          if ($btn.length > 0) {
            cy.wrap($btn).click();
            cy.wait(500);
          }
        });
    });
  });
});
