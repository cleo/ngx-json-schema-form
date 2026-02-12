import { FormDataItem } from './form-data-item';
import { FormDataItemType } from './form-data-item';

export class SecuredStringDataItem extends FormDataItem {
  constructor(key: string, label: string, tooltip: string, helpText: string, public wasRequired: boolean,
              pathParts: string[], value: any, isReadOnly: boolean, isHidden: boolean,
              isEdit: boolean, public placeholder: string) {
    super(key, label, tooltip, helpText, wasRequired, pathParts, FormDataItemType.SecuredString, value, isReadOnly, isHidden);
    this.placeholder = placeholder || '';

    if (isEdit) {
      this.required = false;
    }

    this.disabledState.isDisabledOnSubmit = isEdit && !this.value;
  }
}
