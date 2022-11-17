import { SchemaStringOptions } from '../form-data-item.service';
import { ButtonDataItem } from './button-data-item';
import { FormDataItem } from './form-data-item';
import { FormDataItemType } from './form-data-item';

export class StringDataItem extends FormDataItem {
  placeholder: string;
  display: string;
  validationSettings: StringValidationSettings;

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
              public buttons: ButtonDataItem[],
              schemaOptions: SchemaStringOptions) {
    super(key, label, tooltip, helpText, required, pathParts, type, value, isReadOnly, isHidden);
    this.placeholder = schemaOptions.placeholder;
    this.display = schemaOptions.display;
    this.validationSettings = {
      format: schemaOptions.format && Object.values(StringFormat).includes(schemaOptions.format) ? schemaOptions.format as StringFormat : StringFormat.None,
      length: { minLength: schemaOptions.minLength, maxLength: schemaOptions.maxLength },
      listDelimiter: schemaOptions.listDelimiter,
      pattern: schemaOptions.pattern
    };
  }
}

export enum StringFormat {
  Email = 'email',
  Uri = 'uri',
  None = 'text'
}

export interface StringLengthOptions {
  minLength: number;
  maxLength: number;
}

export interface StringValidationSettings {
  format: StringFormat;
  length: StringLengthOptions;
  listDelimiter: string;
  pattern: string;
}
