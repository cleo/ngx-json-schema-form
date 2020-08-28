import { JSONSchemaProperty } from '../form-data-item.service';
import { EnumDataItem, OptionDisplayType } from './enum-data-item';

describe('EnumDataItem', () => {
  const option1 = 'option1';
  const option2 = 'option2';
  const option3 = 'option3';
  const name1 = '*Option 1*';
  const name2 = '*Option 2*';
  const name3 = '*Option 3*';
  const value = option2;
  const key = 'key';
  const label = 'label';
  const tooltip = 'tooltip';
  const helpText = 'helpText';
  const required = true;
  const pathParts = ['path1', 'path2'];
  const expectedPath = 'path1.path2';
  const isReadOnly = false;
  const isHidden = false;
  const display = OptionDisplayType.DROPDOWN;

  let schema: JSONSchemaProperty;
  let enumDataItem: EnumDataItem;

  beforeEach(() => {
    schema = {
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
    };
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, required, pathParts, value, isReadOnly, isHidden, display, schema);
  });

  it('should set required to true if the display type is radio buttons', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, false, pathParts, value, isReadOnly, isHidden, OptionDisplayType.RADIO_BUTTONS, schema);
    expect(enumDataItem.required).toEqual(true);
  });

  it('should set the enum options', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, required, pathParts, value, isReadOnly, isHidden, display, schema);
    const enumOption1 = enumDataItem.enumOptions[0];
    expect(enumOption1.key).toBe(option1);
    expect(enumOption1.text).toEqual(name1);
    expect(enumOption1.path).toEqual(`${expectedPath}.${option1}`);

    const enumOption2 = enumDataItem.enumOptions[1];
    expect(enumOption2.key).toEqual(option2);
    expect(enumOption2.text).toEqual(name2);
    expect(enumOption2.path).toEqual(`${expectedPath}.${option2}`);

    const enumOption3 = enumDataItem.enumOptions[2];
    expect(enumOption3.key).toEqual(option3);
    expect(enumOption3.text).toEqual(name3);
    expect(enumOption3.path).toEqual(`${expectedPath}.${option3}`);
  });

  it('should use the value passed in as the default value', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, false, pathParts, value, isReadOnly, isHidden, OptionDisplayType.RADIO_BUTTONS, schema);
    expect(enumDataItem.value).toEqual(option2);
  });

  it('should set the value to an empty string if there is no value and the display type is a dropdown', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, false, pathParts, undefined, isReadOnly, isHidden, display, schema);
    expect(enumDataItem.value).toEqual('');
  });

  it('should set the value to the first enum option if there is no value and the display type is a radio button', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, false, pathParts, undefined, isReadOnly, isHidden, OptionDisplayType.RADIO_BUTTONS, schema);
    expect(enumDataItem.value).toEqual(option1);
  });

  describe('with a partial or missing enumNames array', () => {
    it('should set the corresponding enum indeces to the name in that index and then generate the third from the option itself', () => {
      schema.enumNames.pop();
      enumDataItem = new EnumDataItem(key, label, tooltip, helpText, required, pathParts, value, isReadOnly, isHidden, display, schema);

      const enumOption1 = enumDataItem.enumOptions[0];
      expect(enumOption1.key).toBe(option1);
      expect(enumOption1.text).toEqual(name1);
      expect(enumOption1.path).toEqual(`${expectedPath}.${option1}`);

      const enumOption2 = enumDataItem.enumOptions[1];
      expect(enumOption2.key).toEqual(option2);
      expect(enumOption2.text).toEqual(name2);
      expect(enumOption2.path).toEqual(`${expectedPath}.${option2}`);

      const enumOption3 = enumDataItem.enumOptions[2];
      expect(enumOption3.key).toEqual(option3);
      expect(enumOption3.text).toEqual('Option 3');
      expect(enumOption3.path).toEqual(`${expectedPath}.${option3}`);
    });
  });
});
