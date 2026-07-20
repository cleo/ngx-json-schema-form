import { OptionDisplayType } from './enum-data-item';
import { FormDataItemType } from './form-data-item';
import { ParentDataItem } from './parent-data-item';
import { XOfDataItem, XOfType } from './xOf-data-item';

describe('XOfDataItem', () => {
  function build(required: boolean): XOfDataItem {
    return new XOfDataItem('key', 'label', '', '', required, ['key'], '', false, false,
      OptionDisplayType.TABS, [] as ParentDataItem[], '', XOfType.OneOf);
  }

  it('honors required:false from the schema', () => {
    expect(build(false).required).toBe(false);
  });

  it('honors required:true from the schema', () => {
    expect(build(true).required).toBe(true);
  });

  it('passes the schema required value to the inner display enum (dropdown)', () => {
    const child = new ParentDataItem('childKey', 'Child', '', '', false, ['childKey'], FormDataItemType.Object, '', false, false, [], '', OptionDisplayType.DROPDOWN);
    const item = new XOfDataItem('key', 'label', '', '', false, ['key'], 'childKey', false, false,
      OptionDisplayType.DROPDOWN, [child], '', XOfType.OneOf);
    // The first item is the generated XOfEnumDataItem used for display
    expect(item.items[0].required).toBe(false);
  });
});
