import { SchemaValidationService } from './schema-validation.service';

describe('SchemaValidationService', () => {
  let basicSchema: any;

  beforeEach(() => {
    basicSchema = {
      type: 'object',
      required: ['checkboxInput', 'numberInput'],
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
        }
      }
    };
  });

  describe('validate()', () => {
    it('should return an array of errors when missing required properties', () => {
      const result = SchemaValidationService.validate(basicSchema, { textInput: 'abcde' });
      expect(result[0].errorObject.message).toContain('checkboxInput');
      expect(result[1].errorObject.message).toContain('numberInput');
    });

    it('should return an array of errors when missing one properties', () => {
      const result = SchemaValidationService.validate(basicSchema, { textInput: 'abcde', checkboxInput: true});
      expect(result[0].errorObject.message).toContain('numberInput');
    });

    it('should return an null when values are valid', () => {
      const result = SchemaValidationService.validate(basicSchema, { textInput: 'abcde', numberInput: 0, checkboxInput: true});
      expect(result).toBeNull();
    });

    it('should return an array of errors when invalid properties', () => {
      const result = SchemaValidationService.validate(basicSchema, { textInput: 'abc', numberInput: 13, checkboxInput: false });
      expect(result[0].errorObject.message).toContain('should be <= 12');
      expect(result[1].errorObject.message).toContain('should NOT be shorter than 5 characters');
    });
  });

  describe('prettyPrintErrors()', () => {
    it('should format an array of errors when missing required properties', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema, { textInput: 'abcde' }));
      expect(result).toContain('Checkbox Input is required.');
      expect(result).toContain('Number Input is required.');
    });

    it('should format an array of errors when missing one properties', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema, { textInput: 'abcde', checkboxInput: true}));
      expect(result).toContain('Number Input is required.');
    });

    it('should not format errors when values are valid', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema, { textInput: 'abcde', numberInput: 0, checkboxInput: true}));
      expect(result).toEqual('');
    });

    it('should format an array of errors when invalid properties', () => {
      const result = SchemaValidationService.prettyPrintErrors(SchemaValidationService.validate(basicSchema, { textInput: 'abc', numberInput: 13, checkboxInput: false }));
      expect(result).toContain('Text Input should NOT be shorter than 5 characters.');
      expect(result).toContain('Number Input should be <= 12.');
    });
  });
});
