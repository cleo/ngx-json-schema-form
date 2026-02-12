import { FormDataItem, FormDataItemType } from './form-data-item';

export class ArrayDataItem extends FormDataItem {
  public items: FormDataItem[];
  constructor(key: string,
              label: string,
              tooltip: string,
              helpText: string,
              required: boolean,
              pathParts: string[],
              type: FormDataItemType,
              value: any,
              isReadOnly: boolean,
              isHidden: boolean,
              items: FormDataItem[]) {
    super(key, label, tooltip, helpText, required, pathParts, type, value, isReadOnly, isHidden);
    this.items = items;
  }
}
