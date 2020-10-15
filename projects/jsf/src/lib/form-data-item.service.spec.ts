import { FormControl, FormGroup } from '@angular/forms';
import { FormDataItemService } from './form-data-item.service';
import { JSFSchemaData } from './jsf-schema-data';
import { ConditionalParentDataItem, CONDITIONAL_PARENT_VALUE_KEY } from './models/conditional-parent-data-item';
import { EnumDataItem, OptionDisplayType } from './models/enum-data-item';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { SecuredStringDataItem } from './models/secured-string-data-item';
import { StringDataItem } from './models/string-data-item';
import { XOfDataItem } from './models/xOf-data-item';
import { XOfEnumDataItem } from './models/xOf-enum-data-item';
import { SchemaTranslationService } from './schema-translation.service';

describe('FormDataItemService', () => {
  let service: FormDataItemService;
  let translationService: jasmine.SpyObj<SchemaTranslationService>;
  let schema: any;
  let schemaData: JSFSchemaData;
  const name = 'name';
  const tooltip = 'tooltip';
  const helpText = 'helpText';

  beforeEach(() => {
    schema = {
      type: 'object',
      properties: {
      }
    };
    schemaData = new JSFSchemaData(schema, null);

    translationService = jasmine.createSpyObj('schemaTranslationService', [ 'translateToLatest' ]);
    translationService.translateToLatest.and.returnValue(schema);
    service = new FormDataItemService(translationService);
  });

  describe('Boolean Type', () => {
    beforeEach(() => {
      schemaData.schema.properties = {
        booleanKey: {
          type: 'boolean',
          name: name,
          tooltip: tooltip,
          helpText: helpText,
          isReadOnly: true,
          isHidden: true
        }
      };
    });

    it('should set the basic properties', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.label).toEqual(name);
      expect(result.tooltip).toEqual(tooltip);
      expect(result.helpText).toEqual(helpText);
      expect(result.required).toEqual(false);
      expect(result.path).toEqual('booleanKey');
      expect(result.type).toEqual(FormDataItemType.Boolean);
      expect(result.disabledState.isReadOnly).toEqual(true);
      expect(result.isHidden).toEqual(true);
    });

    it('should set the value to false if there are no values', () => {
      schemaData.values = {};
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.value).toEqual(false);
    });

    it('should set the value to false', () => {
      schemaData.values = {
        booleanKey: false
      };
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.value).toEqual(false);
    });

    it('should set the value to true', () => {
      schemaData.values = {
        booleanKey: true
      };
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.value).toEqual(true);
    });
  });

  describe('Integer Type', () => {
    beforeEach(() => {
      schemaData.schema.properties = {
        integerKey: {
          type: 'integer',
          name: name,
          tooltip: tooltip,
          helpText: helpText,
          isReadOnly: true,
          isHidden: true
        }
      };
    });

    it('should set the basic properties', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.label).toEqual(name);
      expect(result.tooltip).toEqual(tooltip);
      expect(result.helpText).toEqual(helpText);
      expect(result.value).toEqual('');
      expect(result.required).toEqual(false);
      expect(result.path).toEqual('integerKey');
      expect(result.type).toEqual(FormDataItemType.Integer);
      expect(result.disabledState.isReadOnly).toEqual(true);
      expect(result.isHidden).toEqual(true);
    });

    it('should set the value to an integer', () => {
      schemaData.values = {
        integerKey: 3
      };
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.value).toEqual(3);
    });
  });

  describe('String Type', () => {
    beforeEach(() => {
      schemaData.schema.properties = {
        stringKey: {
          type: 'string',
          name: name,
          tooltip: tooltip,
          helpText: helpText,
          isSecured: false,
          isReadOnly: true,
          isHidden: true
        }
      };
    });

    it('should set the basic properties', () => {
      const result = service.getFormDataItems(schemaData)[0] as StringDataItem;
      expect(result.label).toEqual(name);
      expect(result.tooltip).toEqual(tooltip);
      expect(result.helpText).toEqual(helpText);
      expect(result.required).toEqual(false);
      expect(result.path).toEqual('stringKey');
      expect(result.type).toEqual(FormDataItemType.String);
      expect(result.disabledState.isReadOnly).toEqual(true);
      expect(result.isHidden).toEqual(true);
    });

    it('should set the value to an empty string if there are no values', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.value).toEqual('');
    });

    it('should set the value to string value', () => {
      const stringValue = 'testString';
      schemaData.values = {
        stringKey: stringValue
      };
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.value).toEqual(stringValue);
    });

    it('should set the type to String', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.type).toEqual(FormDataItemType.String);
    });

    describe('buttons', () => {
      const buttonName = 'Button Name';
      const buttonKey = 'certificateButtonEvent';

      it('should set a button data item if present', () => {
        schemaData.schema.properties.stringKey[buttonKey] = {
          type: 'button',
          name: buttonName,
          targetPaths: ['key1.key2', 'key1.key3']
        };
        const result = service.getFormDataItems(schemaData)[0] as StringDataItem;
        expect(result.buttons.length).toEqual(1);
        expect(result.buttons[0].key).toEqual(buttonKey);
        expect(result.buttons[0].name).toEqual(buttonName);
        expect(result.buttons[0].parentPath).toEqual('stringKey');
        expect(result.buttons[0].targetPaths).toEqual(['key1.key2', 'key1.key3']);
      });

      it('should set defaults properties that are not present', () => {
        schemaData.schema.properties.stringKey[buttonKey] = {
          type: 'button'
        };
        const result = service.getFormDataItems(schemaData)[0] as StringDataItem;
        expect(result.buttons[0].name).toEqual('');
        expect(result.buttons[0].targetPaths).toEqual([]);
      });

      it('should set defaults property when the targetPaths key contains items other than strings', () => {
        schemaData.schema.properties.stringKey[buttonKey] = {
          type: 'button',
          targetPaths: ['key1.key2', 100]
        };
        const result = service.getFormDataItems(schemaData)[0] as StringDataItem;
        expect(result.buttons.length).toEqual(1);
        expect(result.buttons[0].targetPaths).toEqual([]);
      });
    });
  });

  describe('Secured String Type', () => {
    beforeEach(() => {
      schemaData.schema.properties = {
        objectKey: {
          type: 'object',
          name: 'Object Name',
          required: ['stringKey'],
          properties: {
            stringKey: {
              type: 'string',
              name: name,
              tooltip: tooltip,
              helpText: helpText,
              isSecured: true,
              isReadOnly: true,
              isHidden: true
            }
          }
        }
      };
    });

    it('should set the basic properties', () => {
      const resultParent = service.getFormDataItems(schemaData)[0] as ParentDataItem;
      const result = resultParent.items[0] as SecuredStringDataItem;
      expect(result.label).toEqual(name);
      expect(result.tooltip).toEqual(tooltip);
      expect(result.helpText).toEqual(helpText);
      expect(result.wasRequired).toEqual(true);
      expect(result.path).toEqual('objectKey.stringKey');
      expect(result.type).toEqual(FormDataItemType.SecuredString);
      expect(result.disabledState.isReadOnly).toEqual(true);
      expect(result.isHidden).toEqual(true);
    });
  });

  describe('Enum Type', () => {
    const option1 = 'option1';
    const option2 = 'option2';
    const option3 = 'option3';
    const name1 = '*Option 1*';
    const name2 = '*Option 2*';
    const name3 = '*Option 3*';

    beforeEach(() => {
      schemaData.schema.properties = {
        enumKey: {
          name: name,
          tooltip: tooltip,
          helpText: helpText,
          isReadOnly: true,
          isHidden: true,
          display: 'radio-buttons',
          enum: [
            option1,
            option2,
            option3
          ],
          enumNames: [
            name1,
            name2,
            name3
          ]
        }
      };
    });

    it('should set the name', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.label).toEqual(name);
    });

    it('should set the tooltip if it exists', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.tooltip).toEqual(tooltip);
    });

    it('should set the tooltip to an empty string if tooltip does not exist', () => {
      schemaData.schema.properties.enumKey.tooltip = undefined;
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.tooltip).toEqual('');
    });

    it('should set the value to the first option if there are no values', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.value).toEqual(option1);
    });

    it('should set the value to an enum option', () => {
      schemaData.values = {
        enumKey: option2
      };
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.value).toEqual(option2);
    });

    it('should set the path', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.path).toEqual('enumKey');
    });

    it('should set the type to Boolean', () => {
      const result: FormDataItem = service.getFormDataItems(schemaData)[0];
      expect(result.type).toEqual(FormDataItemType.Enum);
    });

    it('should set the display as radio buttons', () => {
      const result: EnumDataItem = (service.getFormDataItems(schemaData)[0] as EnumDataItem);
      expect(result.display).toEqual(OptionDisplayType.RADIO_BUTTONS);
    });

    it('should set the display as dropdowns', () => {
      schemaData.schema.properties.enumKey.display = 'dropdown';
      const result: EnumDataItem = (service.getFormDataItems(schemaData)[0] as EnumDataItem);
      expect(result.display).toEqual(OptionDisplayType.DROPDOWN);
    });

    it('should set the enum options', () => {
      const result: EnumDataItem = (service.getFormDataItems(schemaData)[0] as EnumDataItem);
      expect(result.enumOptions[0].text).toEqual(name1);
      expect(result.enumOptions[1].text).toEqual(name2);
      expect(result.enumOptions[2].text).toEqual(name3);
    });
  });

  describe('Object Type', () => {
    const stringName = 'stringName';
    const booleanName1 = 'booleanName1';
    const booleanName2 = 'booleanName2';
    const description = 'description';
    beforeEach(() => {
      schemaData.schema.properties = {
        objectKey: {
          type: 'object',
          name: name,
          description: description,
          tooltip: tooltip,
          helpText: helpText,
          isReadOnly: true,
          isHidden: true,
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

    it('should set the basic properties', () => {
      const result = service.getFormDataItems(schemaData)[0] as ParentDataItem;
      expect(result.label).toEqual(name);
      expect(result.description).toEqual(description);
      expect(result.tooltip).toEqual(tooltip);
      expect(result.helpText).toEqual(helpText);
      expect(result.path).toEqual('objectKey');
      expect(result.disabledState.isReadOnly).toEqual(true);
      expect(result.isHidden).toEqual(true);
    });

    it('should set child items to readOnly', () => {
      const result = service.getFormDataItems(schemaData)[0] as ParentDataItem;
      expect(result.items[0].disabledState.isReadOnly).toEqual(true);
      expect(result.items[1].disabledState.isReadOnly).toEqual(true);
      expect(result.items[2].disabledState.isReadOnly).toEqual(true);
    });

    it('should set child items as hidden', () => {
      const result = service.getFormDataItems(schemaData)[0] as ParentDataItem;
      expect(result.items[0].isHidden).toEqual(true);
      expect(result.items[1].isHidden).toEqual(true);
      expect(result.items[2].isHidden).toEqual(true);
    });

    it('should set the description to an empty string if the description does not exist', () => {
      schemaData.schema.properties.objectKey.description = undefined;
      const result: ParentDataItem = service.getFormDataItems(schemaData)[0] as ParentDataItem;
      expect(result.description).toEqual('');
    });

    it('should set required keys', () => {
      const resultParent = service.getFormDataItems(schemaData)[0] as ParentDataItem;
      const result = resultParent.items;
      expect(result[0].required).toEqual(true);
      expect(result[1].required).toEqual(true);
      expect(result[2].required).toEqual(false);
    });

    describe('with displaying nested objects', () => {
      beforeEach(() => {
        schemaData.schema.properties = {
          objectKey: {
            type: 'object',
            properties: {
              objectKey1: {
                type: 'object',
                properties: {}
              },
              objectKey2: {
                type: 'object',
                properties: {}
              },
              objectKey3: {
                type: 'object',
                properties: {}
              }
            }
          }
        };
      });

      it('should set the display of each child object as section display when there is no display defined', () => {
        const resultItems = (service.getFormDataItems(schemaData)[0] as ParentDataItem).items;
        expect((resultItems[0] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
        expect((resultItems[1] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
        expect((resultItems[2] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
      });

      it('should set the display of each child object as section display when the display is defined as sections', () => {
        schemaData.schema.properties.objectKey.display = OptionDisplayType.SECTIONS;
        const resultItems = (service.getFormDataItems(schemaData)[0] as ParentDataItem).items;
        expect((resultItems[0] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
        expect((resultItems[1] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
        expect((resultItems[2] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
      });

      it('should set the display of each child object as a tab display if the parent object is set as display of tabs with no tabs array', () => {
        schema.properties.objectKey.display = OptionDisplayType.TABS;
        const resultItems = (service.getFormDataItems(schemaData)[0] as ParentDataItem).items;
        expect((resultItems[0] as ParentDataItem).display).toBe(OptionDisplayType.TABS);
        expect((resultItems[1] as ParentDataItem).display).toBe(OptionDisplayType.TABS);
        expect((resultItems[2] as ParentDataItem).display).toBe(OptionDisplayType.TABS);
      });

      describe('with a tabs array', () => {
        beforeEach(() => {
          schemaData.schema.properties.objectKey.tabs = ['objectKey1', 'objectKey3'];
        });

        it('should ignore the tabs array if the display is set as display of sections', () => {
          schema.properties.objectKey.display = OptionDisplayType.SECTIONS;
          const resultItems = (service.getFormDataItems(schemaData)[0] as ParentDataItem).items;
          expect((resultItems[0] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
          expect((resultItems[1] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
          expect((resultItems[2] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
        });

        describe('and with display set as tabs', () => {
          beforeEach(() => {
            schemaData.schema.properties.objectKey.display = OptionDisplayType.TABS;
          });

          it('should set the display of each child object listed in the tabs array as a tab display if the parent object is set as display of tabs', () => {
            const resultItems = (service.getFormDataItems(schemaData)[0] as ParentDataItem).items;
            expect((resultItems[0] as ParentDataItem).display).toBe(OptionDisplayType.TABS);
            expect((resultItems[1] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
            expect((resultItems[2] as ParentDataItem).display).toBe(OptionDisplayType.TABS);
          });

          it('should ignore the tabs array if the display is not set', () => {
            delete schema.properties.objectKey.display;
            const resultItems = (service.getFormDataItems(schemaData)[0] as ParentDataItem).items;
            expect((resultItems[0] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
            expect((resultItems[1] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
            expect((resultItems[2] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
          });

          it('should set all child objects to a display of section if the tabs array is empty ', () => {
            schema.properties.objectKey.tabs = [];
            const resultItems = (service.getFormDataItems(schemaData)[0] as ParentDataItem).items;
            expect((resultItems[0] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
            expect((resultItems[1] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
            expect((resultItems[2] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
          });

          it('should set only those child objects that are present to a display of tab', () => {
            schema.properties.objectKey.tabs = ['fhekwl', 'hfcuwdhBK', 'objectKey2'];
            const resultItems = (service.getFormDataItems(schemaData)[0] as ParentDataItem).items;
            expect((resultItems[0] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
            expect((resultItems[1] as ParentDataItem).display).toBe(OptionDisplayType.TABS);
            expect((resultItems[2] as ParentDataItem).display).toBe(OptionDisplayType.SECTIONS);
          });
        });
      });
    });
  });

  describe('Conditional Parent Object', () => {
    const stringName = 'stringName';
    const booleanName1 = 'booleanName1';
    const booleanName2 = 'booleanName2';
    const description = 'description';
    beforeEach(() => {
      schemaData.schema.properties = {
        conditionalParentObject: {
          type: 'object',
          name: name,
          tooltip: tooltip,
          helpText: helpText,
          isConditional: true,
          isReadOnly: true,
          isHidden: true,
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

    it('should create a conditional parent item', () => {
      const resultParent = service.getFormDataItems(schemaData)[0];
      expect (resultParent instanceof ConditionalParentDataItem).toBeTruthy();
    });

    it('should set the basic properties', () => {
      const result = service.getFormDataItems(schemaData)[0] as ConditionalParentDataItem;
      expect(result.label).toEqual(name);
      expect(result.tooltip).toEqual(tooltip);
      expect(result.helpText).toEqual(helpText);
      expect(result.required).toEqual(false);
      expect(result.path).toEqual('conditionalParentObject');
      expect(result.type).toEqual(FormDataItemType.Object);
      expect(result.disabledState.isReadOnly).toEqual(true);
      expect(result.isHidden).toEqual(true);
    });

    it('should set child items to readOnly', () => {
      const result = service.getFormDataItems(schemaData)[0] as ConditionalParentDataItem;
      expect(result.items[0].disabledState.isReadOnly).toEqual(true);
      expect(result.items[1].disabledState.isReadOnly).toEqual(true);
      expect(result.items[2].disabledState.isReadOnly).toEqual(true);
    });

    it('should set child items as hidden', () => {
      const result = service.getFormDataItems(schemaData)[0] as ParentDataItem;
      expect(result.items[0].isHidden).toEqual(true);
      expect(result.items[1].isHidden).toEqual(true);
      expect(result.items[2].isHidden).toEqual(true);
    });

    describe('when creating an integration', () => {
      it('should set the conditional parent as unchecked when there is no default', () => {
        const resultParent = service.getFormDataItems(schemaData)[0] as ConditionalParentDataItem;
        const booleanItem = resultParent.items.find(item => item.key === CONDITIONAL_PARENT_VALUE_KEY);
        expect(booleanItem.value).toBe(false);
      });

      it('should set the parent according to the default', () => {
        schema.properties.conditionalParentObject.default = true;
        const resultParent = service.getFormDataItems(schemaData)[0] as ConditionalParentDataItem;
        const booleanItem = resultParent.items.find(item => item.key === CONDITIONAL_PARENT_VALUE_KEY);
        expect(booleanItem.value).toBe(true);
      });
    });

    describe('when editing an integration', () => {
      it('should set the parent value to the user value', () => {
        schemaData.values = {
          conditionalParentObject: {
            value: true
          }
        };

        const resultParent = service.getFormDataItems(schemaData)[0] as ConditionalParentDataItem;
        const booleanItem = resultParent.items.find(item => item.key === CONDITIONAL_PARENT_VALUE_KEY);
        expect(booleanItem.value).toBe(true);
      });

      it('should set the parent value to the default when the user value does not exist', () => {
        schema.properties.conditionalParentObject.default = true;
        schemaData.values = {};
        const resultParent = service.getFormDataItems(schemaData)[0] as ConditionalParentDataItem;
        const booleanItem = resultParent.items.find(item => item.key === CONDITIONAL_PARENT_VALUE_KEY);
        expect(booleanItem.value).toBe(true);
      });

      it('should set the parent value to false when there is no user value or default', () => {
        schemaData.values = {};
        const resultParent = service.getFormDataItems(schemaData)[0] as ConditionalParentDataItem;
        const booleanItem = resultParent.items.find(item => item.key === CONDITIONAL_PARENT_VALUE_KEY);
        expect(booleanItem.value).toBe(false);
      });
    });
  });

  describe('XOf Type', () => {
    const parentName = 'Tabs with AllOf';
    const description = 'This section and tabstrip are displayed using the allOf property. This description and label are defined in the object containing the allOf.';
    const display = 'tabs';

    const child1Name = 'name1';
    const child1Key = 'key1';
    const child1Descr = 'description 1';
    const intName = 'Integer Input';

    const child2Name = 'name2';
    const child2Key = 'key2';
    const child2Descr = 'description 2';

    const oneOfName = 'oneof name';

    const oneOfChildName = 'oneOfChildName';
    const oneOfChildKey = 'oneOfChildKey';
    const oneOfChildOptionName = 'oneOfChildOptionName';

    beforeEach(() => {
      schemaData.schema.properties = {
        tabsWithAllOf: {
          name: parentName,
          type: 'object',
          description: description,
          display: display,
          allOf: [
            {
              type: 'object',
              name: child1Name,
              key: child1Key,
              description: child1Descr,
              isHidden: true,
              properties: {
                integerInput: {
                  type: 'integer',
                  name: intName,
                  helpText: 'This help text will display when you hover over the information icon',
                  tooltip: 'This tooltip will display when you hover over the label.'
                }
              }
            },
            {
              type: 'object',
              name: child2Name,
              key: child2Key,
              description: child2Descr,
              properties: {
                dropdowns: {
                  name: oneOfName,
                  display: 'dropdown',
                  oneOf: [
                    {
                      type: 'object',
                      name: oneOfChildName,
                      key: oneOfChildKey,
                      properties: {
                        child1: {
                          type: 'string',
                          name: oneOfChildOptionName
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      };
    });

    it('should set the basic properties', () => {
      const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
      expect(result.label).toEqual(parentName);
      expect(result.tooltip).toEqual('');
      expect(result.helpText).toEqual('');
      expect(result.required).toEqual(true);
      expect(result.path).toEqual('tabsWithAllOf');
      expect(result.type).toEqual(FormDataItemType.xOf);
      expect(result.disabledState.isReadOnly).toEqual(false);
      expect(result.isHidden).toEqual(false);
      expect(result.items.length).toEqual(2);
    });

    it('should have an additional xOfEnum if the display is not tabs', () => {
      const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
      const oneOfParentItem = result.items[1] as ParentDataItem;
      const oneOfItem = oneOfParentItem.items[0] as XOfDataItem;
      expect(oneOfItem.items.length).toEqual(2);
      expect(oneOfItem.items[0] instanceof XOfEnumDataItem).toEqual(true);
    });

    it('should set the values properly', () => {
      const stringInput1 = 'hello';
      const stringInput2 = 'goodbye';
      const tabsWithAllOfValue = {
        [child1Key]: {
          integerInput: stringInput1
        },
        [child2Key]: {
          dropdowns: {
            [oneOfChildKey]: {
              child1: stringInput2
            }
          }
        }
      };

      schemaData.values = {
        tabsWithAllOf: { ...tabsWithAllOfValue }
      };

      const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
      const resultChildren = result.items as ParentDataItem[];
      const oneOfDropdown = resultChildren[1].items[0] as XOfDataItem;

      expect(result.value).toEqual(tabsWithAllOfValue);
      expect(resultChildren[0].value).toEqual('', 'the first allOf option should not have a value');
      expect(resultChildren[0].items[0].value).toEqual(stringInput1, 'the integer input should have a value of hello');
      expect(resultChildren[1].value).toEqual('', 'the second allOf option should not have a value');
      expect(resultChildren[1].items[0].value).toEqual(oneOfChildKey, 'the dropdowns (oneOf) field should have a value of oneOfChildKey');

      expect((oneOfDropdown.items[0] as XOfEnumDataItem).value).toEqual(oneOfChildKey, 'the XOfEnum data item should have the value of the selected option (oneOfChildKey)');
      expect(oneOfDropdown.items[1].value).toEqual('', 'the first oneOf option should not have a value');
      expect((oneOfDropdown.items[1] as ParentDataItem).items[0].value).toEqual(stringInput2, 'the string child item of the dropdown option should have a value of goodbye');

    });

    describe('display', () => {
      describe('when the allOf display is set as tabs', () => {
        it('should set the allOf parent to a display of sections', () => {
          // display for objects in the schema refers to the display of the object's children.
          // behind the scenes, the display in each data item refers to the display of itself.
          // this is why, even though the display in the schema is defined as tabs, here we expect it to be sections.
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          expect(result.display).toEqual(OptionDisplayType.SECTIONS);
        });

        it('should set the display of the allOf children as tabs', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          const allOfChildren = result.items as ParentDataItem[];
          expect(allOfChildren[0].display).toEqual(OptionDisplayType.TABS);
          expect(allOfChildren[1].display).toEqual(OptionDisplayType.TABS);
        });

        it('should set the oneOf display to the display that was defined in the schema', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          const oneOfItem = ((result.items[1] as ParentDataItem).items[0]) as XOfDataItem;
          expect(oneOfItem.display).toEqual(OptionDisplayType.DROPDOWN);
        });
      });

      describe('when the allOf display is set as sections', () => {
        beforeEach(() => {
          schemaData.schema.properties.tabsWithAllOf.display = 'sections';
        });

        it('should set the allOf parent to a display of sections', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          expect(result.display).toEqual(OptionDisplayType.SECTIONS);
        });

        it('should set the display of the allOf children as sections', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          const allOfChildren = result.items as ParentDataItem[];
          expect(allOfChildren[0].display).toEqual(OptionDisplayType.SECTIONS);
          expect(allOfChildren[1].display).toEqual(OptionDisplayType.SECTIONS);
        });

        it('should set the oneOf display to the display that was defined in the schema', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          const oneOfItem = ((result.items[1] as ParentDataItem).items[0]) as XOfDataItem;
          expect(oneOfItem.display).toEqual(OptionDisplayType.DROPDOWN);
        });
      });

      describe('when the allOf display is set as tabs and its parent object\'s display is also set as tabs', () => {
        beforeEach(() => {
          schemaData.schema.display = 'tabs';
        });

        it('should set the allOf parent to a display of tabs', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          expect(result.display).toEqual(OptionDisplayType.TABS);
        });

        it('should set the display of the allOf children as tabs', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          const allOfChildren = result.items as ParentDataItem[];
          expect(allOfChildren[0].display).toEqual(OptionDisplayType.TABS);
          expect(allOfChildren[1].display).toEqual(OptionDisplayType.TABS);
        });

        it('should set the oneOf display to the display that was defined in the schema', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          const oneOfItem = ((result.items[1] as ParentDataItem).items[0]) as XOfDataItem;
          expect(oneOfItem.display).toEqual(OptionDisplayType.DROPDOWN);
        });
      });

      describe('when the allOf display is set as sections and its parent object\'s display is set as tabs', () => {
        beforeEach(() => {
          schemaData.schema.display = 'tabs';
          schemaData.schema.properties.tabsWithAllOf.display = OptionDisplayType.SECTIONS;
        });

        it('should set the allOf parent to a display of tabs', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          expect(result.display).toEqual(OptionDisplayType.TABS);
        });

        it('should set the display of the allOf children as sections', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          const allOfChildren = result.items as ParentDataItem[];
          expect(allOfChildren[0].display).toEqual(OptionDisplayType.SECTIONS);
          expect(allOfChildren[1].display).toEqual(OptionDisplayType.SECTIONS);
        });

        it('should set the oneOf display to the display that was defined in the schema', () => {
          const result = service.getFormDataItems(schemaData)[0] as XOfDataItem;
          const oneOfItem = ((result.items[1] as ParentDataItem).items[0]) as XOfDataItem;
          expect(oneOfItem.display).toEqual(OptionDisplayType.DROPDOWN);
        });
      });
    });
  });

  describe('findFormDataItem()', () => {
    const value = 'value';
    const key = 'key1';
    const parentKey = 'parentKey';
    const label = 'label';
    const required = true;

    let dataItem: FormDataItem;
    let dataItem2: FormDataItem;
    let parentDataItem: ParentDataItem;

    beforeEach(() => {
      dataItem = new FormDataItem(key, label, tooltip, helpText, required, [], FormDataItemType.String, value, false, false);
      dataItem2 = new FormDataItem('key2', label, tooltip, helpText, required, [], FormDataItemType.String, value, false, false);
      parentDataItem = new ParentDataItem(parentKey, label, tooltip, helpText,
                                          required, [], FormDataItemType.Object,
                                          value, false, false, [dataItem, dataItem2],
                                          '', OptionDisplayType.SECTIONS);
    });

    it('should return null if there is nothing in the path array', () => {
      const result = service.findFormDataItem([], [parentDataItem]);
      expect(result).toBeNull();
    });

    it('should return null if nothing is found', () => {
      const result = service.findFormDataItem(['invalidKey'], [parentDataItem]);
      expect(result).toBeNull();
    });

    it('should find a child form Control at the root level', () => {
      const result = service.findFormDataItem([key], [dataItem]);
      expect(result.key).toEqual(key);
      expect(result).toEqual(dataItem);
    });

    it('should find a nested child form Control', () => {
      const result = service.findFormDataItem([parentKey, key], [parentDataItem]);
      expect(result.key).toEqual(key);
      expect(result).toEqual(dataItem);
    });

    it('should return null if the path points to a FormControl, but there is more to the path', () => {
      const result = service.findFormDataItem([parentKey, key, 'extraKey'], [parentDataItem]);
      expect(result).toBeNull();
    });
  });
});
