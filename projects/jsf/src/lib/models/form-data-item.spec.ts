import { FormDataItem, FormDataItemType } from './form-data-item';

describe('SchemaDataItem', () =>  {
  const value = 'value';
  const key = 'key';
  const label = 'label';
  const tooltip = 'tooltip';
  const helpText = 'helpText';
  const required = true;
  const pathParts = ['path1', 'path2'];
  const expectedPath = 'path1.path2';
  const type = FormDataItemType.String;

  let dataItem: FormDataItem;

  beforeEach(() => {
    dataItem = new FormDataItem(key, label, tooltip, helpText, required, pathParts, type, value);
  });

  it('should set the value', () => {
    expect(dataItem.value).toEqual(value);
  });

  it('should set the value to an empty string', () => {
    const result = new FormDataItem(key, label, tooltip, helpText, required, pathParts, type, undefined);
    expect(result.value).toEqual('');
  });

  it('should set the key', () => {
    expect(dataItem.key).toEqual(key);
  });

  it('should set the label', () => {
    expect(dataItem.label).toEqual(label);
  });

  it('should set the tooltip', () => {
    expect(dataItem.tooltip).toEqual(tooltip);
  });

  it('should set the tooltip to an empty string if it is undefined', () => {
    const result = new FormDataItem(key, label, undefined, helpText, required, pathParts, type, value);
    expect(result.tooltip).toEqual('');
  });

  it('should set the helpText', () => {
    expect(dataItem.helpText).toEqual(helpText);
  });

  it('should set the helpText to an empty string if it is undefined', () => {
    const result = new FormDataItem(key, label, tooltip, undefined, required, pathParts, type, value);
    expect(result.helpText).toEqual('');
  });

  it('should set the required property', () => {
    expect(dataItem.required).toEqual(required);
  });

  it('should set the pathParts', () => {
    expect(dataItem.pathParts).toEqual(pathParts);
  });

  it('should set the type', () => {
    expect(dataItem.type).toEqual(type);
  });

  it('should set the path', () => {
    expect(dataItem.path).toEqual(expectedPath);
  });
});
