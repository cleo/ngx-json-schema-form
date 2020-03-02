import { RequiredSchemaValueValidationService } from './required-schema-value-validation.service';
import { SchemaHelperService } from './schema-helper.service';

describe('RequiredSchemaValueValidationService', () => {
  describe('getRequiredKeysFromSchemaOnly()', () => {

    // TODO fix this bug
    xit('should return an array of required paths when at the root level of the schema', () => {
      const schema = {
        type: 'object',
        required: ['checkbox', 'numberInput'],
        properties: {
          checkbox: {
            type: 'boolean',
            name: 'Checkbox Input'
          },
          numberInput: {
            type: 'number',
            name: 'Number Input'
          },
          textInput: {
            type: 'string',
            name: 'Text Input'
          }
        }
      };

      const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
      const result = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaOnly(flattenedSchema);
      expect(result[0]).toEqual('checkbox');
      expect(result[1]).toEqual('numberInput');
    });

    it('should return an array of required paths when nested beneath a parent object', () => {
      const schema = {
        object: {
          type: 'object',
          required: ['checkbox', 'numberInput'],
          properties: {
            checkbox: {
              type: 'boolean',
              name: 'Checkbox Input'
            },
            numberInput: {
              type: 'number',
              name: 'Number Input'
            },
            textInput: {
              type: 'string',
              name: 'Text Input'
            }
          }
        }
      };

      const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
      const result = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaOnly(flattenedSchema);
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual('object.checkbox');
      expect(result[1]).toEqual('object.numberInput');
    });

    it('should return an array of required paths when a required field is deeply nested', () => {
      const schema = {
        object1: {
          type: 'object',
          properties: {
            object2: {
              type: 'object',
              properties: {
                object3: {
                  type: 'object',
                  required: ['checkbox'],
                  properties: {
                    checkbox: {
                      type: 'boolean',
                      name: 'Checkbox Input'
                    }
                  }
                }
              }
            }
          }
        }
      };

      const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
      const result = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaOnly(flattenedSchema);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual('object1.object2.object3.checkbox');
    });

    it('should return an array of required paths when a required field is an XOf object', () => {
      const schema = {
        object: {
          type: 'object',
          properties: {
            dropdownWithChildren: {
              name: 'Dropdown with Children 1',
              display: 'dropdown',
              oneOf: [
                {
                  type: 'object',
                  name: 'Option 1',
                  key: 'option1',
                  required: ['child1'],
                  properties: {
                    child1: {
                      type: 'string',
                      name: 'Child 1 of Option 1'
                    },
                    child2: {
                      type: 'string',
                      name: 'Child 2 of Option 1'
                    }
                  }
                },
                {
                  type: 'object',
                  name: 'Option 2',
                  key: 'option2',
                  required: [ 'child2' ],
                  properties: {
                    child1: {
                      type: 'string',
                      name: 'Child 1 of Option 2'
                    },
                    child2: {
                      type: 'string',
                      name: 'Child 2 of Option 2'
                    }
                  }
                }
              ]
            }
          }
        }
      };

      const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
      const result = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaOnly(flattenedSchema);
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual('object.dropdownWithChildren.oneOf[0].child1');
      expect(result[1]).toEqual('object.dropdownWithChildren.oneOf[1].child2');
    });
  });
});
