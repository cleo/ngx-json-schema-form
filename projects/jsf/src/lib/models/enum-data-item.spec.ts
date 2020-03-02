import { JSONSchemaProperty } from '../jsf-data-item.service';
import { EnumDataItem, OptionDisplayType } from './enum-data-item';

describe('EnumDataItem', () => {
  const option1 = { key: 'option1', name: 'Option 1'};
  const option2 = { key: 'option2', name: 'Option 2'};
  const option3 = { key: 'option3', name: 'Option 3'};
  const value = option2.key;
  const key = 'key';
  const label = 'label';
  const tooltip = 'tooltip';
  const helpText = 'helpText';
  const required = true;
  const pathParts = ['path1', 'path2'];
  const expectedPath = 'path1.path2';
  const display = OptionDisplayType.DROPDOWN;
  const schema: JSONSchemaProperty = {
    enum: [
      option1,
      option2,
      option3
    ]
  };

  let enumDataItem: EnumDataItem;

  beforeEach(() => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, required, pathParts, value, display, schema);
  });

  it('should set required to true if the display type is radio buttons', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, false, pathParts, value, OptionDisplayType.RADIO_BUTTONS, schema);
    expect(enumDataItem.required).toEqual(true);
  });

  it('should set the enum options', () => {
    const enumOption1 = enumDataItem.enumOptions[0];
    expect(enumOption1.key).toEqual(option1.key);
    expect(enumOption1.text).toEqual(option1.name);
    expect(enumOption1.path).toEqual(`${expectedPath}.${option1.key}`);

    const enumOption2 = enumDataItem.enumOptions[1];
    expect(enumOption2.key).toEqual(option2.key);
    expect(enumOption2.text).toEqual(option2.name);
    expect(enumOption2.path).toEqual(`${expectedPath}.${option2.key}`);

    const enumOption3 = enumDataItem.enumOptions[2];
    expect(enumOption3.key).toEqual(option3.key);
    expect(enumOption3.text).toEqual(option3.name);
    expect(enumOption3.path).toEqual(`${expectedPath}.${option3.key}`);
  });

  it('should use the value passed in as the default value', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, false, pathParts, value, OptionDisplayType.RADIO_BUTTONS, schema);
    expect(enumDataItem.value).toEqual(option2.key);
  });

  it('should set the value to an empty string if there is no value and the display type is a dropdown', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, false, pathParts, undefined, display, schema);
    expect(enumDataItem.value).toEqual('');
  });

  it('should set the value to the first enum option if there is no value and the display type is a radio button', () => {
    enumDataItem = new EnumDataItem(key, label, tooltip, helpText, false, pathParts, undefined, OptionDisplayType.RADIO_BUTTONS, schema);
    expect(enumDataItem.value).toEqual(option1.key);
  });
});
