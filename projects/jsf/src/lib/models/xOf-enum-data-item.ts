import { EnumDataItem, EnumOption, OptionDisplayType } from './enum-data-item';

export class XOfEnumDataItem extends EnumDataItem {
  constructor(key: string, label: string, description: string, helpText: string, required: boolean,
              pathParts: string[], value: any, display: OptionDisplayType, enumOptions: EnumOption[]) {
    super(key, label, description, helpText, required, pathParts, value, display);
    this.enumOptions = enumOptions;
    this.setEmptyValue();
  }
}
