import { FormDataItem, FormDataItemType } from './form-data-item';
import { ParentDataItem } from './parent-data-item';

export const CONDITIONAL_DISABLED_PARENT_VALUE_KEY = 'value';

export class ConditionalDisabledParentDataItem extends ParentDataItem {
  constructor(key: string,
              label: string,
              tooltip: string,
              helpText: string,
              required: boolean,
              pathParts: string[],
              value: any,
              isReadOnly: boolean,
              isHidden: boolean,
              items: FormDataItem[],
              isStrongLabel?: boolean) {
    super(key, label, tooltip, helpText, required, pathParts, FormDataItemType.Object, value, isReadOnly, isHidden, items, '', undefined, isStrongLabel);
    const valuePathParts = this.pathParts.slice();
    valuePathParts.push(CONDITIONAL_DISABLED_PARENT_VALUE_KEY);

    // This FormDataItem controls the checkbox for the control and will result in the "value" property on the integration.
    const booleanValue = typeof value === 'object' ? value[CONDITIONAL_DISABLED_PARENT_VALUE_KEY] : !!value;
    const booleanDataItem = new FormDataItem(
      CONDITIONAL_DISABLED_PARENT_VALUE_KEY,
      this.label,
      this.description,
      this.helpText,
      false,
      valuePathParts,
      FormDataItemType.Boolean,
      booleanValue,
      isReadOnly,
      isHidden,
      isStrongLabel);

    this.items.push(booleanDataItem);
  }
}
