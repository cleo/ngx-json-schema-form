import { SecuredSchemaValueValidationService } from './secured-schema-value-validation.service';

describe('SchemaValueSecuredValidationService', () => {
  describe('getSecuredKeyPaths()', () => {
    it('should return an array of key paths that are secured', () => {
      const schema = {
        'key1.properties.key2.name': 'Value 1',
        'key1.properties.key2.type': 'string',
        'key1.properties.key2.isSecured': true,
        'key1.properties.key3.isSecured': true
      };

      const result = SecuredSchemaValueValidationService.getSecuredKeyPaths(schema);
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual('key1.key2');
      expect(result[1]).toEqual('key1.key3');
    });

    it('should ignore key paths that are marked as not secured', () => {
      const schema = {
        'key1.properties.key2.name': 'Value 1',
        'key1.properties.key2.type': 'string',
        'key1.properties.isSecured': false
      };

      const result = SecuredSchemaValueValidationService.getSecuredKeyPaths(schema);
      expect(result.length).toEqual(0);
    });
  });

  describe('getNonSecuredValues()', () => {
    const schema = {
      type: 'object',
      properties: {
        securedTextInput: {
          type: 'object',
          name: 'Secured Text Inputs',
          description: 'This section displays the functionality of the secured text inputs.',
          properties: {
            securedTextInput: {
              type: 'string',
              name: 'Required Secured Text Input',
              helpText: 'This help text will display when you hover over the information icon',
              tooltip: 'This tooltip will display when you hover over the label.',
              isSecured: true
            }
          }
        },
        numberInputs: {
          type: 'object',
          name: 'Number Inputs',
          description: 'This section displays number input functionality of the JSF.',
          properties: {
            numberInput: {
              type: 'number',
              name: 'Number Input',
              helpText: 'This help text will display when you hover over the information icon',
              tooltip: 'This tooltip will display when you hover over the label.'
            }
          }
        },
        arrayInput: {
          type: 'array',
          name: 'Array Input',
          description: 'This section displays array input functionality of the JSF.',
          items: {
            properties: {
              numberInput: {
                type: 'number',
                name: 'Number Input',
                helpText: 'This help text will display when you hover over the information icon',
                tooltip: 'This tooltip will display when you hover over the label.'
              }
            }
          }
        }
      }
    };

    const values = {
      securedTextInput: {
        securedTextInput: 'asdf'
      },
      numberInputs: {
        numberInput: 100
      },
      arrayInput: [{ numberInput: '100' }]
    };

    it('should return an empty object if there are no values', () => {
      const result = SecuredSchemaValueValidationService.getNonSecuredValues({}, {});
      expect(Object.keys(result).length).toEqual(0);
    });

    it('should return all non-secured schema values', () => {
      const result = SecuredSchemaValueValidationService.getNonSecuredValues(values, schema);
      expect(result.securedTextInput.securedTextInput).toBeUndefined();
      expect(result.numberInputs.numberInput).toEqual(100);
      expect(result.arrayInput[0]).toEqual({ numberInput: '100'});
    });

    it('should return secured values as null', () => {
      const result = SecuredSchemaValueValidationService.getNonSecuredValues(values, schema, true);
      expect(result.securedTextInput.securedTextInput).toBeNull();
      expect(result.numberInputs.numberInput).toEqual(100);
      expect(result.arrayInput[0]).toEqual({ numberInput: '100'});
    });

    it('should not return secured text that returns an object', () => {
      const nestedSchema = {
        type: 'object',
        properties: {
          securedTextInput: {
            type: 'object',
            name: 'Secured Text Inputs',
            description: 'This section displays the functionality of the secured text inputs.',
            properties: {
              securedTextInput: {
                type: 'string',
                name: 'Required Secured Text Input',
                helpText: 'This help text will display when you hover over the information icon',
                tooltip: 'This tooltip will display when you hover over the label.',
                isSecured: true
              }
            }
          },
          numberInputs: {
            type: 'object',
            name: 'Number Inputs',
            description: 'This section displays number input functionality of the JSF.',
            properties: {
              numberInput: {
                type: 'number',
                name: 'Number Input',
                helpText: 'This help text will display when you hover over the information icon',
                tooltip: 'This tooltip will display when you hover over the label.'
              }
            }
          }
        }
      };

      const nestedValues = {
        securedTextInput: {
          securedTextInput: {
            key1: 'key1',
            key2: 'key2'
          }
        },
        numberInputs: {
          numberInput: 100
        }
      };

      const result = SecuredSchemaValueValidationService.getNonSecuredValues(nestedValues, nestedSchema);
      expect(result.securedTextInput.securedTextInput).toBeUndefined();
      expect(result.numberInputs.numberInput).toEqual(100);
    });
  });
});
