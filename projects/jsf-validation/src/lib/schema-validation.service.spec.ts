import { AdditionalPropertiesParams } from 'ajv';
import { JSFErrorObject, SchemaValidationService } from './schema-validation.service';

describe('SchemaValidationService', () => {
  let basicSchema: any;

  beforeEach(() => {
    basicSchema = {
      type: 'object',
      required: ['checkboxInput', 'numberInput', 'arrayInput', 'defaultedRequiredValue'],
      properties: {
        checkboxInput: {
          type: 'boolean',
          name: 'Checkbox Input'
        },
        numberInput: {
          type: 'number',
          name: 'Number Input',
          minimum: 0,
          maximum: 12
        },
        textInput: {
          type: 'string',
          name: 'Text Input',
          minLength: 5,
          maxLength: 10
        },
        defaultedRequiredValue: {
          type: 'string',
          name: 'Default Text Input',
          default: 'should not cause error when value is omitted'
        },
        arrayInput: {
          type: 'array',
          name: 'Array field',
          items: {
            properties: {
              textItem: {
                type: 'string',
                name: 'Text Item',
                minLength: 5,
                maxLength: 10
              },
              requiredItem: {
                type: 'string',
                name: 'Required Item'
              },
              requiredItemWithDefault: {
                type: 'string',
                name: 'Default Required Item',
                default: 'should not cause error when value is omitted'
              }
            },
            required: ['requiredItem', 'requiredItemWithDefault']
          }
        },
        templateInput: {
          type: 'object',
          name: 'Template Test',
          properties: {
            templateDisplay: {
              name: 'Template 1',
              type: 'template',
              isReadOnly: true,
              templateName: 'testTemplate1',
              targetPaths: [
                'templateInput.templateValue',
                'templateInput.templateVisibleValue'
              ]
            },
            templateValue: {
              name: 'Hidden template value',
              type: 'string',
              isHidden: true
            },
            templateVisibleValue: {
              name: 'Visible template value',
              type: 'string',
              isHidden: false
            }
          },
          additionalProperties: false
        },
        buttonInput: {
          name: 'button 1',
          type: 'button',
          isReadOnly: true,
          targetPaths: [
            'buttonValue'
          ]
        },
        buttonValue: {
          name: 'Hidden value',
          type: 'string',
          isHidden: true
        }
      }
    };
  });

  describe('validate()', () => {
    it('should validate uri format, and at different depths', () => {
      let err: JSFErrorObject[] = [];

      let uriSchema: any = {
        type: 'object',
        properties: {
          inbound: {
            name: 'inbound',
            type: 'object',
            properties: {
              url: {
                type: 'string',
                name: 'my uri string',
                format: 'uri'
              }
            }
          }
        }
      };
      err = SchemaValidationService.validate(uriSchema, {inbound: {url: 'https://t'}});
      expect(err[0].errorObject.schemaPath).toBe('properties.inbound.properties.url.format');
      err = SchemaValidationService.validate(uriSchema, {inbound: {url: 'https://test.com'}});
      expect(err).toBe(null);

      uriSchema = {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            name: 'my uri string',
            format: 'uri'
          }
        }
      };
      err = SchemaValidationService.validate(uriSchema, {url: 'https://t'});
      expect(err[0].errorObject.schemaPath).toBe('properties.url.format');
      err = SchemaValidationService.validate(uriSchema, {url: 'https://test.com'});
      expect(err).toBe(null);
    });

    it('should return an array of errors when missing required properties', () => {
      const result = SchemaValidationService.validate(basicSchema, {textInput: 'abcde'});
      expect(result[0].errorObject.message).toContain('checkboxInput');
      expect(result[1].errorObject.message).toContain('numberInput');
      expect(result[2].errorObject.message).toContain('arrayInput');
    });

    it('should return an array of errors when missing one property', () => {
      const result = SchemaValidationService.validate(basicSchema,
        {
          textInput: 'abcde',
          checkboxInput: true,
          arrayInput: [{textItem: 'abcde', requiredItem: 'abcde'}]
        }
      );
      expect(result[0].errorObject.message).toContain('numberInput');
    });

    it('should return an null when values are valid', () => {
      const result = SchemaValidationService.validate(basicSchema,
        {
          textInput: 'abcde',
          numberInput: 0,
          checkboxInput: true,
          arrayInput: [{textItem: 'abcde', requiredItem: 'abcde'}]
        }
      );
      expect(result).toBeNull();
    });

    it('should return an array of errors when invalid properties', () => {
      const result = SchemaValidationService.validate(basicSchema, {textInput: 'abc', numberInput: 13, checkboxInput: false});
      expect(result[0].errorObject.message).toContain('should be <= 12');
      expect(result[1].errorObject.message).toContain('should NOT be shorter than 5 characters');
      expect(result[2].errorObject.message).toContain("should have required property 'arrayInput'");
    });

    it('should return an error when array value is invalid', () => {
      const result = SchemaValidationService.validate(basicSchema,
        {
          textInput: 'abcde',
          numberInput: 0,
          checkboxInput: true,
          arrayInput: [{textItem: 'abc', requiredItem: 'abcde'}]
        }
      );
      expect(result[0].errorObject.message).toContain('should NOT be shorter than 5 characters');
    });

    it('should throw an error when template type values are set', () => {
      const result = SchemaValidationService.validate(basicSchema,
        {
          textInput: 'abcde',
          checkboxInput: true,
          arrayInput: [{textItem: 'abcde', requiredItem: 'abcde'}],
          numberInput: 1,
          templateInput: {templateDisplay: '1', templateVisibleValue: '2', templateValue: '3'}
        }
      );
      expect((result[0].errorObject.params as AdditionalPropertiesParams).additionalProperty).toContain('templateDisplay');
    });

  });

  describe('prettyPrintErrors()', () => {
    it('should format an array of errors when missing required properties', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema, {textInput: 'abcde'}));
      expect(result).toContain('Checkbox Input is required.');
      expect(result).toContain('Number Input is required.');
      expect(result).toContain('Array field is required.');
    });

    it('should format an array of errors when missing properties', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema, {textInput: 'abcde', checkboxInput: true}));
      expect(result).toContain('Number Input is required.');
      expect(result).toContain('Array field is required.');
    });

    it('should not format errors when values are valid', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema,
        {
          textInput: 'abcde',
          numberInput: 0,
          checkboxInput: true,
          arrayInput: [{textItem: 'abcde', requiredItem: 'abcde'}]
        }
      ));
      expect(result).toEqual('');
    });

    it('should format an array of errors when invalid properties', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema,
        {
          textInput: 'abc',
          numberInput: 13,
          checkboxInput: false
        }
      ));
      expect(result).toContain('Text Input should NOT be shorter than 5 characters.');
      expect(result).toContain('Number Input should be <= 12.');
      expect(result).toContain('Array field is required.');
    });

    it('should format an array of errors when invalid array item', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema,
        {
          textInput: 'abcde',
          numberInput: 10,
          checkboxInput: false,
          arrayInput: [{textItem: 'abcde'}]
        }
      ));
      expect(result).toContain('Required Item is required.');
    });
  });
});
