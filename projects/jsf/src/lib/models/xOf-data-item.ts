import { EnumDataItem, getEnumOption, OptionDisplayType } from './enum-data-item';
import { FormDataItem, FormDataItemType } from './form-data-item';
import { ParentDataItem } from './parent-data-item';
import { XOfEnumDataItem } from './xOf-enum-data-item';

export class XOfDataItem extends ParentDataItem {
  constructor(
    key: string,
    label: string,
    tooltip: string,
    helpText: string,
    required: boolean,
    pathParts: string[],
    value: any,
    isReadOnly: boolean,
    isHidden: boolean,
    display: OptionDisplayType,
    items: ParentDataItem[],
    description: string,
    public xOfType: XOfType) {
    super(key, label, tooltip, helpText, required, pathParts, FormDataItemType.xOf, value, isReadOnly, isHidden, items, description, display);
    this.required = true;

    // TODO: The XOf Enum item is added for the purpose of display. Possibly improve in the future so that this is not needed.
    if (this.display !== OptionDisplayType.TABS && this.display !== OptionDisplayType.SECTIONS) {
      const enumDataItem = this.parseEnumData(items);
      this.items = [ enumDataItem as FormDataItem ].concat(items as FormDataItem[]);
    }
  }

  private parseEnumData(children: ParentDataItem[]): EnumDataItem {
    const enumOptions = children.map(item => getEnumOption(item.key, item.label, this.path));

    if (typeof this.value !== 'string') {
      this.value = Object.keys(this.value)[0];
    }

    const enumDataItem = new XOfEnumDataItem(
      this.key,
      this.label,
      this.tooltip,
      this.helpText,
      true,
      this.pathParts,
      this.value,
      this.disabledState.isReadOnly,
      this.isHidden,
      this.display,
      enumOptions);
    enumDataItem.disabledState.isDisabledOnSubmit = true;
    return enumDataItem;
  }
}

export enum XOfType {
  AllOf = 'allOf',
  AnyOf = 'anyOf',
  OneOf = 'oneOf'
}
