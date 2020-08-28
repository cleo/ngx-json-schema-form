import { FormDataItem, FormDataItemType } from './form-data-item';
import { ParentDataItem } from './parent-data-item';

export const CONDITIONAL_PARENT_VALUE_KEY = 'value';

export class ConditionalParentDataItem extends ParentDataItem {
  constructor(key: string,
              label: string,
              tooltip: string,
              helpText: string,
              required: boolean,
              pathParts: string[],
              value: any,
              isReadOnly: boolean,
              isHidden: boolean ,
              items: FormDataItem[]) {
    super(key, label, tooltip, helpText, required, pathParts, FormDataItemType.Object, value, isReadOnly, isHidden, items, '');
    const valuePathParts = this.pathParts.slice();
    valuePathParts.push(CONDITIONAL_PARENT_VALUE_KEY);

    // this FormDataItem controls the checkbox for the hierarchical control and will result in the "value" property on the integration.
    // The value that is sent to the constructor is the value taken from the schema with values[conditionalObjectKey], which is an object.
    // However, we also need its boolean value, which indicates whether the checkbox was checked.
    // If a default is set, it is a boolean, but if there are values that are provided (edit case), we must extract that boolean value from the value object.
    // This is why the boolean value is calculated here.
    const booleanValue = typeof value === 'object' ? value[CONDITIONAL_PARENT_VALUE_KEY] : !!value;
    const booleanDataItem = new FormDataItem(
      CONDITIONAL_PARENT_VALUE_KEY,
      this.label,
      this.description,
      this.helpText,
      false,
      valuePathParts,
      FormDataItemType.Boolean,
      booleanValue,
      isReadOnly,
      isHidden);

    this.items.push(booleanDataItem);
  }
}
