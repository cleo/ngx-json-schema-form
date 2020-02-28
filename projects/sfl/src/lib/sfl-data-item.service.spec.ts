import { CONDITIONAL_PARENT_VALUE_KEY, ConditionalParentDataItem } from './models/conditional-parent-data-item';
import { EnumDataItem, OptionDisplayType } from './models/enum-data-item';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { StringDataItem, StringValidationType } from './models/string-data-item';
import { SFLDataItemService } from './sfl-data-item.service';

describe('SchemaDataItemService', () => {
  let service: SFLDataItemService;
  let schema: any;
  const name = 'name';
  const tooltip = 'tooltip';

  beforeEach(() => {
    service = new SFLDataItemService();
    schema = {
      type: 'object',
      properties: {
      }
    };
  });

  describe('Boolean Type', () => {
    beforeEach(() => {
      schema.properties = {
        booleanKey: {
          type: 'boolean',
          name: name,
          tooltip: tooltip
        }
      };
    });

    it('should set the name', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.label).toEqual(name);
    });

    it('should set the tooltip if it exists', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.tooltip).toEqual(tooltip);
    });

    it('should set the tooltip to an empty string if tooltip does not exist', () => {
      schema.properties.booleanKey.tooltip = undefined;
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.tooltip).toEqual('');
    });

    it('should set the value to false if there are no values', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.value).toEqual(false);
    });

    it('should set the value to false', () => {
      const value = {
        booleanKey: false
      };
      const result: FormDataItem = service.getFormDataItems(schema, value, true)[0];
      expect(result.value).toEqual(false);
    });

    it('should set the value to true', () => {
      const value = {
        booleanKey: true
      };
      const result: FormDataItem = service.getFormDataItems(schema, value, true)[0];
      expect(result.value).toEqual(true);
    });

    it('should set required to false', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.required).toEqual(false);
    });

    it('should set the path', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.path).toEqual('booleanKey');
    });

    it('should set the type to Boolean', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.type).toEqual(FormDataItemType.Boolean);
    });
  });

  describe('Number Type', () => {
    beforeEach(() => {
      schema.properties = {
        numberKey: {
          type: 'number',
          name: name,
          tooltip: tooltip
        }
      };
    });

    it('should set the name', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.label).toEqual(name);
    });

    it('should set the tooltip if it exists', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.tooltip).toEqual(tooltip);
    });

    it('should set the tooltip to an empty string if tooltip does not exist', () => {
      schema.properties.numberKey.tooltip = undefined;
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.tooltip).toEqual('');
    });

    it('should set the value to an empty string if there are no values', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.value).toEqual('');
    });

    it('should set the value to a number', () => {
      const value = {
        numberKey: 3
      };
      const result: FormDataItem = service.getFormDataItems(schema, value, true)[0];
      expect(result.value).toEqual(3);
    });

    it('should set the path', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.path).toEqual('numberKey');
    });

    it('should set the type to Number', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.type).toEqual(FormDataItemType.Number);
    });
  });

  describe('String Type', () => {
    const delimiter = ';';
    const validation = 'email';
    beforeEach(() => {
      schema.properties = {
        stringKey: {
          type: 'string',
          name: name,
          tooltip: tooltip,
          validation: validation,
          isSecured: false,
          listDelimiter: delimiter
        }
      };
    });

    it('should set the name', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.label).toEqual(name);
    });

    it('should set the tooltip if it exists', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.tooltip).toEqual(tooltip);
    });

    it('should set the tooltip to an empty string if tooltip does not exist', () => {
      schema.properties.stringKey.tooltip = undefined;
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.tooltip).toEqual('');
    });

    it('should set the value to an empty string if there are no values', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.value).toEqual('');
    });

    it('should set the value to string value', () => {
      const stringValue = 'testString';
      const value = {
        stringKey: stringValue
      };
      const result: FormDataItem = service.getFormDataItems(schema, value, true)[0];
      expect(result.value).toEqual(stringValue);
    });

    it('should set the path', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.path).toEqual('stringKey');
    });

    it('should set the type to String', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.type).toEqual(FormDataItemType.String);
    });

    it('should set the validation', () => {
      const result = service.getFormDataItems(schema, null, false)[0] as StringDataItem;
      expect(result.validationType).toEqual(StringValidationType.Email);
    });

    it('should set the validation to None if there is a typo in the validation', () => {
      schema.properties.stringKey.validation = 'emal';
      const result = service.getFormDataItems(schema, null, false)[0] as StringDataItem;
      expect(result.validationType).toEqual(StringValidationType.None);
    });

    it('should set the validation to None if there it is unset', () => {
      schema.properties.stringKey.validation = undefined;
      const result = service.getFormDataItems(schema, null, false)[0] as StringDataItem;
      expect(result.validationType).toEqual(StringValidationType.None);
    });

    it('should set isSecured to false', () => {
      const result = service.getFormDataItems(schema, null, false)[0] as StringDataItem;
      expect(result.securedItemData.isSecured).toEqual(false);
    });

    it('should set isSecured to false it is undefined', () => {
      schema.properties.stringKey.isSecured = undefined;
      const result = service.getFormDataItems(schema, null, false)[0] as StringDataItem;
      expect(result.securedItemData.isSecured).toEqual(false);
    });

    it('should set listOptions with delimiter', () => {
      const result = service.getFormDataItems(schema, null, false)[0] as StringDataItem;
      expect(result.listOptions.isList).toEqual(true);
      expect(result.listOptions.delimiter).toEqual(delimiter);
    });

    it('should set isList to false if it is not present', () => {
      schema.properties.stringKey.listDelimiter = undefined;
      const result = service.getFormDataItems(schema, null, false)[0] as StringDataItem;
      expect(result.listOptions.isList).toEqual(false);
      expect(result.listOptions.delimiter).toEqual(undefined);
    });
  });

  describe('Secured String Type', () => {
    beforeEach(() => {
      schema.properties = {
        objectKey: {
          type: 'object',
          name: 'Object Name',
          required: ['stringKey'],
          properties: {
            stringKey: {
              type: 'string',
              name: name,
              tooltip: tooltip,
              isSecured: true
            }
          }
        }
      };
    });

    it('should set isSecured to true', () => {
      const resultParent = service.getFormDataItems(schema, null, false)[0] as ParentDataItem;
      const result = resultParent.items[0] as StringDataItem;
      expect(result.securedItemData.isSecured).toEqual(true);
    });

    describe('secured string NOT during form edit', () => {
      it('should set wasRequired and required to true if required', () => {
        const resultParent = service.getFormDataItems(schema, null, false)[0] as ParentDataItem;
        const result = resultParent.items[0] as StringDataItem;
        expect(result.securedItemData.wasRequired).toEqual(true);
        expect(result.required).toEqual(true);
      });

      it('should set wasRequired and required to false if not required', () => {
        schema.properties.objectKey.required = [];
        const resultParent = service.getFormDataItems(schema, null, false)[0] as ParentDataItem;
        const result = resultParent.items[0] as StringDataItem;
        expect(result.securedItemData.wasRequired).toEqual(false);
        expect(result.required).toEqual(false);
      });
    });

    describe('secured string during form edit', () => {
      it('should set wasRequired to true if required', () => {
        const resultParent = service.getFormDataItems(schema, null, true)[0] as ParentDataItem;
        const result = resultParent.items[0] as StringDataItem;
        expect(result.securedItemData.wasRequired).toEqual(true);
      });

      it('should set required to false if required', () => {
        const resultParent = service.getFormDataItems(schema, null, true)[0] as ParentDataItem;
        const result = resultParent.items[0] as StringDataItem;
        expect(result.required).toEqual(false);
      });

      it('should set wasRequired and required to false if not required', () => {
        schema.properties.objectKey.required = [];
        const resultParent = service.getFormDataItems(schema, null, true)[0] as ParentDataItem;
        const result = resultParent.items[0] as StringDataItem;
        expect(result.securedItemData.wasRequired).toEqual(false);
        expect(result.required).toEqual(false);
      });
    });
  });

  describe('Enum Type', () => {
    const option1 = { key: 'option1', name: 'Option 1'};
    const option2 = { key: 'option2', name: 'Option 2'};
    const option3 = { key: 'option3', name: 'Option 3'};
    beforeEach(() => {
      schema.properties = {
        enumKey: {
          name: name,
          tooltip: tooltip,
          display: 'radio-buttons',
          enum: [
            option1,
            option2,
            option3
          ]
        }
      };
    });

    it('should set the name', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.label).toEqual(name);
    });

    it('should set the tooltip if it exists', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.tooltip).toEqual(tooltip);
    });

    it('should set the tooltip to an empty string if tooltip does not exist', () => {
      schema.properties.enumKey.tooltip = undefined;
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.tooltip).toEqual('');
    });

    it('should set the value to the first option if there are no values', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.value).toEqual(option1.key);
    });

    it('should set the value to an enum option', () => {
      const value = {
        enumKey: option2.key
      };
      const result: FormDataItem = service.getFormDataItems(schema, value, true)[0];
      expect(result.value).toEqual(option2.key);
    });

    it('should set the path', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.path).toEqual('enumKey');
    });

    it('should set the type to Boolean', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.type).toEqual(FormDataItemType.Enum);
    });

    it('should set the display as radio buttons', () => {
      const result = service.getFormDataItems(schema, null, false)[0] as EnumDataItem;
      expect(result.display).toEqual(OptionDisplayType.RADIO_BUTTONS);
    });

    it('should set the display as dropdowns', () => {
      schema.properties.enumKey.display = 'dropdown';
      const result = service.getFormDataItems(schema, null, false)[0] as EnumDataItem;
      expect(result.display).toEqual(OptionDisplayType.DROPDOWN);
    });

    it('should set the enum options', () => {
      const result = service.getFormDataItems(schema, null, false)[0] as EnumDataItem;
      expect(result.enumOptions[0].text).toEqual(option1.name);
      expect(result.enumOptions[1].text).toEqual(option2.name);
      expect(result.enumOptions[2].text).toEqual(option3.name);
    });
  });

  describe('Object Type', () => {
    const stringName = 'stringName';
    const booleanName1 = 'booleanName1';
    const booleanName2 = 'booleanName2';
    const description = 'description';
    beforeEach(() => {
      schema.properties = {
        objectKey: {
          type: 'object',
          name: name,
          description: description,
          required: ['stringKey', 'booleanKey'],
          properties: {
            stringKey: {
              type: 'string',
              name: stringName,
              description: description
            },
            booleanKey: {
              type: 'boolean',
              name: booleanName1,
              description: description
            },
            booleanKey2: {
              type: 'boolean',
              name: booleanName2,
              description: description
            }
          }
        }
      };
    });

    it('should set the name', () => {
      const result: FormDataItem = service.getFormDataItems(schema, null, false)[0];
      expect(result.label).toEqual(name);
    });

    it('should set the description if it exists', () => {
      const result: ParentDataItem = service.getFormDataItems(schema, null, false)[0] as ParentDataItem;
      expect(result.description).toEqual(description);
    });

    it('should set the description to an empty string if the description does not exist', () => {
      schema.properties.objectKey.description = undefined;
      const result: ParentDataItem = service.getFormDataItems(schema, null, false)[0] as ParentDataItem;
      expect(result.description).toEqual('');
    });

    it('should set required keys', () => {
      const resultParent = service.getFormDataItems(schema, null, false)[0] as ParentDataItem;
      const result = resultParent.items;
      expect(result[0].required).toEqual(true);
      expect(result[1].required).toEqual(true);
      expect(result[2].required).toEqual(false);
    });
  });

  describe('Conditional Parent Object', () => {
    beforeEach(() => {
      schema.properties = {
        conditionalParentObject: {
          type: 'object',
          name: 'objectName',
          isConditional: true,
          properties: {}
        }
      };
    });

    it('should create a conditional parent item', () => {
      const resultParent = service.getFormDataItems(schema, null, false)[0];
      expect (resultParent instanceof ConditionalParentDataItem).toBeTruthy();
    });

    describe('when creating an integration', () => {
      it('should set the conditional parent as unchecked when there is no default', () => {
        const resultParent = service.getFormDataItems(schema, null, false)[0] as ConditionalParentDataItem;
        expect(resultParent.items[0].key).toBe(CONDITIONAL_PARENT_VALUE_KEY);
        expect(resultParent.items[0].value).toBe(false);
      });

      it('should set the parent according to the default', () => {
        schema.properties.conditionalParentObject.default = true;
        const resultParent = service.getFormDataItems(schema, null, false)[0] as ConditionalParentDataItem;
        expect(resultParent.items[0].value).toBe(true);
      });
    });

    describe('when editing an integration', () => {
      it('should set the parent value to the user value', () => {
        const values = {
          conditionalParentObject: {
            value: true
          }
        };

        const resultParent = service.getFormDataItems(schema, values, true)[0] as ConditionalParentDataItem;
        expect(resultParent.items[0].value).toBe(true);
      });

      it('should set the parent value to the default when the user value does not exist', () => {
        schema.properties.conditionalParentObject.default = true;
        const resultParent = service.getFormDataItems(schema, {}, true)[0] as ConditionalParentDataItem;
        expect(resultParent.items[0].value).toBe(true);
      });

      it('should set the parent value to false when there is no user value or default', () => {
        const resultParent = service.getFormDataItems(schema, {}, true)[0] as ConditionalParentDataItem;
        expect(resultParent.items[0].value).toBe(false);
      });
    });
  });
});
