import { JSONSchemaProperty } from '../form-data-item.service';
import { FormDataItem } from './form-data-item';
import { FormDataItemType } from './form-data-item';

export class EnumDataItem extends FormDataItem {
  enumOptions: EnumOption[];

  constructor(key: string,
              label: string,
              tooltip: string,
              helpText: string,
              required: boolean,
              pathParts: string[],
              value: any,
              isReadOnly: boolean,
              isHidden: boolean,
              public display: OptionDisplayType,
              schema?: JSONSchemaProperty) {
    super(key, label, tooltip, helpText, required, pathParts, FormDataItemType.Enum, value, isReadOnly, isHidden);
    if (schema) {
      this.enumOptions = schema.enum.map((item: any, i: number) => {
        const text = schema.enumNames && schema.enumNames[i] ? schema.enumNames[i] : this.camelCaseToTitleCase(item);
        return getEnumOption(item, text, this.path);
      });
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

  // https://stackoverflow.com/a/35953318
  private camelCaseToTitleCase(str: string) {
    const result = str
      .replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
      .replace(/([A-Z][a-z])([A-Z])/g, '$1 $2')
      .replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2')
      .replace(/([a-z]+)([A-Z0-9]+)/g, '$1 $2')

      // Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
      .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, '$1 $2')
      .replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2')

      // Note: the next two regexes use {2,} instead of + to add space on phrases like Room26A and 26ABCs but not on phrases like R2D2 and C3PO"
      .replace(/([A-Z]{2,})([0-9]{2,})/g, '$1 $2')
      .replace(/([0-9]{2,})([A-Z]{2,})/g, '$1 $2')
      .trim();

    // capitalize the first letter
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

}

export function getEmptyEnumValue(display: OptionDisplayType, enumOptions: EnumOption[]): string {
  let defaultValue = '';
  switch (display) {
    case OptionDisplayType.DROPDOWN:
      defaultValue = '';
      break;
    case OptionDisplayType.RADIO_BUTTONS:
      defaultValue = enumOptions[0].key;
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
  RADIO_BUTTONS = 'radio-buttons',
  SECTIONS = 'sections',
  TABS = 'tabs'
}
