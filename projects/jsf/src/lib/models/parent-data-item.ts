import { OptionDisplayType } from './enum-data-item';
import { FormDataItem, FormDataItemType } from './form-data-item';

export class ParentDataItem extends FormDataItem {
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
              public items: FormDataItem[],
              public description: string = '',
              public display: OptionDisplayType = OptionDisplayType.SECTIONS) {
    super(key, label, tooltip, helpText, required, pathParts, type, value, isReadOnly, isHidden);
  }
}
