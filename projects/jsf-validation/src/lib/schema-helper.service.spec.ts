import { SchemaHelperService } from './schema-helper.service';

describe('SchemaHelperService', () => {

  describe('getFlattenedObject()', () => {
    it('should flatten an object', () => {
      const value1 = 'value1';
      const value2 = 'value2';
      const schema = {
        key1: value1,
        key2: value2
      };

      const result = SchemaHelperService.getFlattenedObject(schema);
      expect(result.key1).toEqual(value1);
      expect(result.key2).toEqual(value2);
    });

    it('should be flatten the keys of child values into one path', () => {
      const child1 = 'childValue1';
      const child2 = 'childValue2';
      const schema = {
        key: {
          child1: child1,
          child2: child2
        }
      };

      const result = SchemaHelperService.getFlattenedObject(schema);
      expect(result['key.child1']).toEqual(child1);
      expect(result['key.child2']).toEqual(child2);
    });

    it('should flatten an array', () => {
      const item1 = 'item1';
      const item2 = 'item2';
      const schema = {
        key: [item1, item2]
      };

      const result = SchemaHelperService.getFlattenedObject(schema);
      expect(result['key[0]']).toEqual(item1);
      expect(result['key[1]']).toEqual(item2);
    });
  });

  it('should flatten an enum object and add required flag', () => {
      const schema = {
        enumInput: {
          name: 'Enum Input',
          display: 'dropdown',
          enum: [
            'option1',
            'option2'
          ]
        }
      };

      const result = SchemaHelperService.getFlattenedObject(schema);
      expect(result['required[0]']).toEqual('enumInput');
    });

  it('should flatten the keys of child enum values and add required flag', () => {
      const schema = {
        key: {
          properties: {
            enumInput: {
              name: 'Enum Input',
              display: 'dropdown',
              enum: [
                'option1',
                'option2'
              ]
            }
          }
        }
      };

      const result = SchemaHelperService.getFlattenedObject(schema);
      expect(result['key.required[0]']).toEqual('enumInput');
    });

  describe('formatKeyPath()', () => {
    it('should remove the keyword "properties" from the key path', () => {
      const keyPath = 'key1.key2.properties.key4.key5';
      const result = SchemaHelperService.formatKeyPath(keyPath);
      expect(result).toEqual('key1.key2.key4.key5');
    });

    it('should remove the keyword "isSecured" from the key path', () => {
      const keyPath = 'key1.key2.isSecured.key4.key5';
      const result = SchemaHelperService.formatKeyPath(keyPath);
      expect(result).toEqual('key1.key2.key4.key5');
    });

    it('should remove the keyword "required" from the key path', () => {
      const keyPath = 'key1.key2.required.key4.key5';
      const result = SchemaHelperService.formatKeyPath(keyPath);
      expect(result).toEqual('key1.key2.key4.key5');
    });
  });

  describe('removeUnsupportedTypes()', () => {
    it('should remove objects that have a type of template', () => {
      const schema = {
        templateDisplay: {
          name: 'Template 1',
          type: 'template',
          isReadOnly: true,
          templateName: 'testTemplate1',
          targetPaths: [
            'templateValue',
            'templateVisibleValue'
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
      };

      const result = SchemaHelperService.removeUnsupportedTypes(schema);
      expect(result.templateValue).toBeDefined('Template Value should remain');
      expect(result.templateVisibleValue).toBeDefined('Template VisibleValue should remain');
      expect(result.templateDisplay).toBeUndefined('TemplateDisplay should have been removed');
    });

    it('should remove objects that have a type of button', () => {
      const schema = {
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
      };

      const result = SchemaHelperService.removeUnsupportedTypes(schema);
      expect(result).toBeDefined('AAH NO RESULT');
      expect(result.buttonValue).toBeDefined('Button Value should remain');
      expect(result.buttonInput).toBeUndefined('ButtonInput should have been removed');
    });
  });
});
