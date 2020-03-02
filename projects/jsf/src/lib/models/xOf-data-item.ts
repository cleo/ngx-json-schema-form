import { JSONSchemaProperty } from '../jsf-data-item.service';
import { EnumDataItem, getEnumOption } from './enum-data-item';
import { OptionDisplayType } from './enum-data-item';
import { FormDataItem, FormDataItemType } from './form-data-item';
import { ParentDataItem } from './parent-data-item';
import { XOfEnumDataItem } from './xOf-enum-data-item';

export class XOfDataItem extends ParentDataItem {
  containerType: XOfType;
  display: OptionDisplayType;

  constructor(key: string,  label: string,  tooltip: string, helpText: string,  required: boolean,
              pathParts: string[], value: any, schema: JSONSchemaProperty, public items: FormDataItem[]) {
    super(key, label, tooltip, helpText, required, pathParts, FormDataItemType.xOf, value, items, '');
    this.required = true;
    this.display = schema.display as OptionDisplayType;
    this.containerType = this.getXOfType(schema);

    const enumDataItem = this.parseEnumData(items);
    this.items = [ enumDataItem as FormDataItem ].concat(items);
  }

  private parseEnumData(children: FormDataItem[]): EnumDataItem {
    const enumOptions = children.map((item: ParentDataItem) => getEnumOption(item.key, item.label, this.path));

    if (!(typeof this.value === 'string')) {
      this.value = Object.keys(this.value)[0];
    }

    const enumDataItem =  new XOfEnumDataItem(this.key, this.label, this.tooltip, this.helpText,
      true, this.pathParts, this.value, this.display, enumOptions);
    enumDataItem.disabledOnSubmit = true;
    return enumDataItem;
  }

  private getXOfType(obj: any): XOfType {
    if (obj.allOf) {
      return XOfType.AllOf;
    }

    if (obj.oneOf) {
      return XOfType.OneOf;
    }

    if (obj.anyOf) {
      return XOfType.AnyOf;
    }
  }
}

export enum XOfType {
  AllOf = 'allOf',
  AnyOf = 'anyOf',
  OneOf = 'oneOf'
}
