import { JSONSchemaProperty, SchemaEnumItem } from '../jsf-data-item.service';
import { FormDataItem } from './form-data-item';
import { FormDataItemType } from './form-data-item';

export class EnumDataItem extends FormDataItem {
  enumOptions: EnumOption[];

  constructor(key: string, label: string, tooltip: string, helpText: string, required: boolean,
              pathParts: string[], value: any, public display: OptionDisplayType, schema?: JSONSchemaProperty) {
    super(key, label, tooltip, helpText, required, pathParts, FormDataItemType.Enum, value);
    if (schema) {
      this.enumOptions = schema.enum.map((item:  SchemaEnumItem) => getEnumOption(item.key, item.name, this.path));
      this.setEmptyValue();
    }

    if (this.display === OptionDisplayType.RADIO_BUTTONS) {
      this.required = true;
    }
  }

  protected setEmptyValue(): void {
    if (!this.value) {
      this.value = getEmptyEnumValue(this.display, this.enumOptions);
    }
  }
}

export function getEmptyEnumValue(display: OptionDisplayType, enumOptions: EnumOption[]): string {
  let defaultValue = '';
  switch (display) {
    case OptionDisplayType.DROPDOWN:
      defaultValue = '';
      break;
    case OptionDisplayType.RADIO_BUTTONS:
      defaultValue = enumOptions[ 0 ].key;
      break;
  }
  return defaultValue;
}

export function getEnumOption(key: string, label: string, basePath: string): EnumOption {
  return { key: key, text: label, path: `${basePath}.${key}` };
}

export interface EnumOption {
  key: string;
  text: string;
  path: string;
}

export enum OptionDisplayType {
  DROPDOWN = 'dropdown',
  RADIO_BUTTONS = 'radio-buttons'
}
