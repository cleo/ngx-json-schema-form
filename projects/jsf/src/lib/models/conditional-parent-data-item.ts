import { FormDataItem, FormDataItemType } from './form-data-item';
import { ParentDataItem } from './parent-data-item';

export const CONDITIONAL_PARENT_VALUE_KEY = 'value';

export class ConditionalParentDataItem extends ParentDataItem {
  isConditional: boolean;
  constructor(key: string,  label: string,  tooltip: string, helpText: string,  required: boolean,
              pathParts: string[], value: any, items: FormDataItem[]) {
    super(key, label, tooltip, helpText, required, pathParts, FormDataItemType.Object, value, items, '');
    this.isConditional = true;
    const valuePathParts = this.pathParts.slice();
    valuePathParts.push(CONDITIONAL_PARENT_VALUE_KEY);
    // this FormDataItem controls the checkbox for the hierarchical control and will result in the "value" property on the integration
    const booleanDataItem = new FormDataItem(CONDITIONAL_PARENT_VALUE_KEY, this.label,
      this.description, this.helpText, false, valuePathParts, FormDataItemType.Boolean,
      value);

    this.items.push(booleanDataItem);
  }
}
