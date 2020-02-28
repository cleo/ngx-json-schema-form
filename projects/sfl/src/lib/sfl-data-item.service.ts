import { Injectable } from '@angular/core';

import { CONDITIONAL_PARENT_VALUE_KEY, ConditionalParentDataItem } from './models/conditional-parent-data-item';
import { EnumDataItem } from './models/enum-data-item';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { StringDataItem } from './models/string-data-item';
import { XOfDataItem, XOfType } from './models/xOf-data-item';

@Injectable()
export class SFLDataItemService {
  private isEdit = false;

  getFormDataItems(schema: JSONSchema, values: object, isEdit: boolean): FormDataItem[] {
    this.isEdit = isEdit;
    return this.getItemsFromSubschema(schema, values, []);
  }

  private getItemsFromSubschema(schema: JSONSchema, values: object, pathParts: string[]): FormDataItem[] {
    return Object.keys(schema.properties).map(key => {
      return this.getItemFromSchema(schema, values, key, pathParts.slice());
    });
  }

  private getItemFromSchema(schema: JSONSchema, values: any, key: string, pathParts: string[]): FormDataItem {
    pathParts.push(key);

    const schemaProperty = schema.properties[key];
    const name = schemaProperty.name;
    const tooltip = schemaProperty.tooltip;
    const helpText = schemaProperty.helpText;
    const required = this.getRequired(schema, key);
    const type = this.getFormDataItemType(schemaProperty);
    let value;

    const hasValue = values && !isNullOrUndefined(values[key]);
    const hasDefault = !isNullOrUndefined(schemaProperty.default);

    if (this.isEdit) {
      value = hasValue ? values[key] : hasDefault ? schemaProperty.default : null;
    } else {
      value = hasDefault ? schemaProperty.default : null;
    }

    switch (type) {
      case FormDataItemType.xOf:
        const objects =
          schemaProperty[ XOfType.OneOf ] ||
          schemaProperty[ XOfType.AllOf ] ||
          schemaProperty[ XOfType.AnyOf ];
        const children = this.getXOfChildren(objects, values, key, pathParts);

        return new XOfDataItem(key, name, tooltip, helpText, required,  pathParts,  value, schemaProperty, children);
      case FormDataItemType.Enum:
        return new EnumDataItem(key, name, tooltip, helpText, required,  pathParts, value, schemaProperty.display, schemaProperty);
      case FormDataItemType.Boolean:
        return new FormDataItem(key, name, tooltip, helpText, required,  pathParts, type, !!value);
      case FormDataItemType.Object:
        const childItems = this.getItemsFromSubschema(schemaProperty, value, pathParts);
        if (schemaProperty.isConditional) {
          if (this.isEdit) {
            value = hasValue ? values[key][CONDITIONAL_PARENT_VALUE_KEY] : hasDefault ? schemaProperty.default : false;
          } else {
            value = hasDefault ? schemaProperty.default : false;
          }
          return new ConditionalParentDataItem(key, name, tooltip, helpText, required,  pathParts, value, childItems);
        }
        return new ParentDataItem(key, name, tooltip, helpText, required, pathParts, type, value, childItems, schemaProperty.description);
      default: // String or Number
        return new StringDataItem(key, name, tooltip, helpText, required, pathParts, type, value, schemaProperty, this.isEdit, schemaProperty.placeholder);
    }
  }

  getFormDataItemType(schemaProperty: JSONSchemaProperty): FormDataItemType {
    if (schemaProperty.enum) {
      return FormDataItemType.Enum;
    }

    const isXOf = Object.values(XOfType).some(val => Boolean(schemaProperty[val]));
    if (isXOf) {
      return FormDataItemType.xOf;
    }

    switch (schemaProperty.type) {
      case SchemaTypes.Boolean:
        return FormDataItemType.Boolean;
      case SchemaTypes.Number:
        return FormDataItemType.Number;
      case SchemaTypes.Object:
        return FormDataItemType.Object;
      default:
        return FormDataItemType.String;
    }
  }

  private getRequired(schema: JSONSchema, key: string): boolean {
    const alwaysRequired = Boolean(schema.required) && schema.required.indexOf(key) !== -1;
    const conditionallyRequired = Boolean(schema.conditionallyRequired) && schema.conditionallyRequired.indexOf(key) !== -1;
    return alwaysRequired || conditionallyRequired;
  }

  private getXOfChildren(objects: JSONSchema[], values: any, key: string, pathParts: string[]): ParentDataItem[] {
    return objects.map((object, idx) => {
      const childPathParts = pathParts.slice();
      childPathParts.push(idx.toString());
      const objectValues =
        values && values[ key ]
          ? values[ key ][ object.key ]
          : {};

      const items = this.getItemsFromSubschema(object, objectValues, pathParts);
      return new ParentDataItem(object.key, object.name, object.tooltip, object.helpText, false,
        childPathParts, FormDataItemType.Object, '', items, object.description);
    });
  }
}

function isNullOrUndefined(value): boolean {
  return value === null || value === undefined;
}

enum SchemaTypes {
  Boolean = 'boolean',
  Number = 'number',
  Object = 'object',
  String = 'string'
}

export interface SecuredData {
  isSecured: boolean;
  wasRequired: boolean;
}

export interface JSONSchema {
  type: string;
  name?: string;
  description?: string;
  properties: any;
  required?: string[];
  conditionallyRequired?: string[];
  isConditional?: boolean;
  key?: string;
  helpText?: string;
  tooltip?: string;
}

export interface JSONSchemaProperty {
  type?: string;
  name?: string;
  description?: string;
  enum?: SchemaEnumItem[];
  display?: string;
  isSecured?: boolean;
  validation?: string;
  listDelimiter?: string;
  helpText?: string;
  tooltip?: string;
}

export interface SchemaEnumItem {
  name: string;
  key: string;
}
