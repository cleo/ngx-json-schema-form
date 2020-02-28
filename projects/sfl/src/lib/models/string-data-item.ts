import { JSONSchemaProperty } from '../sfl-data-item.service';
import { SecuredData } from '../sfl-data-item.service';
import { FormDataItem } from './form-data-item';
import { FormDataItemType } from './form-data-item';

export class StringDataItem extends FormDataItem {
  validationType: StringValidationType;
  listOptions: StringListOptions;
  securedItemData: SecuredData;

  constructor(key: string, label: string, tooltip: string, helpText: string, required: boolean,
              pathParts: string[], type: FormDataItemType, value: any, schema: JSONSchemaProperty,
              isEdit: boolean, public placeholder: string) {
    super(key, label, tooltip, helpText, required, pathParts, type, value);
    this.placeholder = placeholder || '';

    this.securedItemData = { isSecured: Boolean(schema.isSecured), wasRequired: this.required };
    if (isEdit && Boolean(schema.isSecured)) {
      this.required = false;
    }

    this.disabledOnSubmit = this.securedItemData.isSecured && isEdit && !this.value;

    const validation: string = schema.validation;
    this.validationType = validation && Object.values(StringValidationType).includes(validation) ? validation as StringValidationType : StringValidationType.None;
    this.listOptions = { isList: Boolean(schema.listDelimiter), delimiter: schema.listDelimiter };
  }
}

export enum StringValidationType {
  Email = 'email',
  Url = 'url',
  None = 'text'
}

export interface StringListOptions {
  isList: boolean;
  delimiter: string;
}
