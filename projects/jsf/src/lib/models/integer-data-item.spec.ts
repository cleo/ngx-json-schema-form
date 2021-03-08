import { SchemaIntegerOptions } from '../form-data-item.service';
import { FormDataItemType } from './form-data-item';
import { IntegerDataItem } from './integer-data-item';

describe('IntegerDataItem', () => {
  const key = 'key';
  const label = 'label';
  const tooltip = 'tooltip';
  const helpText = 'helpText';
  const pathParts = ['parentKey', key];
  const type = FormDataItemType.Integer;
  const value = undefined;
  const placeholder = 'placeholder';
  const isReadOnly = false;
  const isHidden = false;

  let schemaIntegerOptions: SchemaIntegerOptions;

  beforeEach(() => {
    schemaIntegerOptions = {} as SchemaIntegerOptions;
  });

  it('should set placeholder', () => {
    schemaIntegerOptions.placeholder = placeholder;
    const result = new IntegerDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaIntegerOptions);
    expect(result.placeholder).toEqual(placeholder);
  });

  it('should set the maximum and minimum lengths', () => {
    const min = 5;
    const max = 10;
    schemaIntegerOptions.minLength = min;
    schemaIntegerOptions.maxLength = max;
    const result = new IntegerDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaIntegerOptions);

    expect(result.validationSettings.length.minLength).toEqual(min);
    expect(result.validationSettings.length.maxLength).toEqual(max);
  });

  it('should not set the min and max lengths if they are not present', () => {
    const result = new IntegerDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaIntegerOptions);
    expect(result.validationSettings.length.minLength).toBeUndefined();
    expect(result.validationSettings.length.maxLength).toBeUndefined();
  });

  it('should set the maximum and minimum values', () => {
    const min = -5;
    const max = 10;
    schemaIntegerOptions.minimum = min;
    schemaIntegerOptions.maximum = max;
    const result = new IntegerDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaIntegerOptions);

    expect(result.validationSettings.range.minimum).toEqual(min);
    expect(result.validationSettings.range.maximum).toEqual(max);
  });

  it('should set the exclusiveMaximum and exclusiveMinimum values', () => {
    const min = 5;
    const max = 10;
    schemaIntegerOptions.exclusiveMinimum = min;
    schemaIntegerOptions.exclusiveMaximum = max;
    const result = new IntegerDataItem(key, label, tooltip, helpText, true, pathParts, type, value, isReadOnly, isHidden, [], schemaIntegerOptions);

    expect(result.validationSettings.range.exclusiveMinimum).toEqual(min);
    expect(result.validationSettings.range.exclusiveMaximum).toEqual(max);
  });
});
