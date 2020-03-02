import { FormDataItem, FormDataItemType } from './form-data-item';

export class ParentDataItem extends FormDataItem {
  constructor(key: string,  label: string,  tooltip: string, helpText: string,  required: boolean,  pathParts: string[],
              type: FormDataItemType, value: any,  public items: FormDataItem[], public description: string) {
    super(key, label, tooltip, helpText, required, pathParts, type, value);
    this.description = description || '';
  }
}
