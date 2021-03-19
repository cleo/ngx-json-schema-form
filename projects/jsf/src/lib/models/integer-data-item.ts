import { SchemaIntegerOptions } from '../form-data-item.service';
import { ButtonDataItem } from './button-data-item';
import { FormDataItem } from './form-data-item';
import { FormDataItemType } from './form-data-item';

export class IntegerDataItem extends FormDataItem {
  placeholder: string;
  display: string;
  validationSettings: IntegerValidationSettings;

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
              schemaOptions: SchemaIntegerOptions) {
    super(key, label, tooltip, helpText, required, pathParts, type, value, isReadOnly, isHidden);
    this.placeholder = schemaOptions.placeholder;
    this.display = schemaOptions.display;
    this.validationSettings = {
      range: { minimum: schemaOptions.minimum, exclusiveMinimum: schemaOptions.exclusiveMinimum,
               maximum: schemaOptions.maximum, exclusiveMaximum: schemaOptions.exclusiveMaximum }
    };
  }
}

export interface IntegerRangeOptions {
  minimum: number;
  maximum: number;
  exclusiveMaximum: number;
  exclusiveMinimum: number;
}

export interface IntegerValidationSettings {
  range: IntegerRangeOptions;
}
