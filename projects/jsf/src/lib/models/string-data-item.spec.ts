import { SchemaStringOptions } from '../form-data-item.service';
import { FormDataItemType } from './form-data-item';
import { StringDataItem, StringFormat } from './string-data-item';

describe('StringDataItem', () => {
  const key = 'key';
  const label = 'label';
  const tooltip = 'tooltip';
  const helpText = 'helpText';
  const pathParts = ['parentKey', key];
  const type = FormDataItemType.String;
  const value = undefined;
  const placeholder = 'placeholder';
  const delimiter = ';';
  const format = 'email';
  const isReadOnly = false;
  const isHidden = false;
  const schema = {
    type: 'string',
    name: name,
    tooltip: tooltip,
    format: format,
    isSecured: false,
    listDelimiter: delimiter
  };

  let schemaStringOptions: SchemaStringOptions;

  beforeEach(() => {
    schemaStringOptions = {} as SchemaStringOptions;
  });

  it('should set placeholder', () => {
    schemaStringOptions.placeholder = placeholder;
    const result = new StringDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaStringOptions);
    expect(result.placeholder).toEqual(placeholder);
  });

  it('should set the format', () => {
    schemaStringOptions.format = StringFormat.Email;
    const result = new StringDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaStringOptions);
    expect(result.validationSettings.format).toEqual(StringFormat.Email);
  });

  it('should set the format to None if there is a typo in the format', () => {
    schemaStringOptions.format = 'eml' as StringFormat;
    const result = new StringDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaStringOptions);
    expect(result.validationSettings.format).toEqual(StringFormat.None);
  });

  it('should set the format to None if it is unset', () => {
    const result = new StringDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaStringOptions);
    expect(result.validationSettings.format).toEqual(StringFormat.None);
  });

  it('should set the list delimiter', () => {
    schemaStringOptions.listDelimiter = delimiter;
    const result = new StringDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaStringOptions);
    expect(result.validationSettings.listDelimiter).toEqual(delimiter);
  });

  it('should set the maximum and minimum lengths', () => {
    const min = 5;
    const max = 10;
    schemaStringOptions.minLength = min;
    schemaStringOptions.maxLength = max;
    const result = new StringDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaStringOptions);

    expect(result.validationSettings.length.minLength).toEqual(min);
    expect(result.validationSettings.length.maxLength).toEqual(max);
  });

  it('should not set the min and max lengths if they are not present', () => {
    const result = new StringDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaStringOptions);
    expect(result.validationSettings.length.minLength).toBeUndefined();
    expect(result.validationSettings.length.maxLength).toBeUndefined();
  });
});
