import { Injectable } from '@angular/core';

import { JSFJsonSchema } from './jsf-json-schema';
import { JSFSchemaData } from './jsf-schema-data';
import { ButtonDataItem } from './models/button-data-item';
import { ConditionalParentDataItem } from './models/conditional-parent-data-item';
import { EnumDataItem, OptionDisplayType } from './models/enum-data-item';
import { FormDataItem, FormDataItemType } from './models/form-data-item';
import { IntegerDataItem } from './models/integer-data-item';
import { ParentDataItem } from './models/parent-data-item';
import { SecuredStringDataItem } from './models/secured-string-data-item';
import { StringDataItem, StringFormat } from './models/string-data-item';
import { XOfDataItem, XOfType } from './models/xOf-data-item';
import { SchemaTranslationService } from './schema-translation.service';

@Injectable()
export class FormDataItemService {
  private isEdit = false;

  constructor(private schemaTranslationService: SchemaTranslationService) {}

  public isFormInEditMode(schemaData: JSFSchemaData): boolean {
    return !!schemaData.values && Object.keys(schemaData.values).length > 0;
  }

  public getFormDataItems(schemaData: JSFSchemaData): FormDataItem[] {
    this.isEdit = this.isFormInEditMode(schemaData);
    const latestSchema = this.schemaTranslationService.translateToLatest(schemaData.schema);
    return this.getItemsFromSubschema(latestSchema, schemaData.values, [], false, false);
  }

  private getItemsFromSubschema(schema: JSFJsonSchema, values: object, pathParts: string[], isParentReadOnly: boolean, isParentHidden: boolean): FormDataItem[] {
    return Object.keys(schema.properties).map(key => {
      return this.getItemFromSchema(schema, values, key, pathParts.slice(), isParentReadOnly, isParentHidden);
    });
  }

  private getItemFromSchema(schema: JSFJsonSchema, values: any, key: string, pathParts: string[], isParentReadOnly: boolean, isParentHidden: boolean): FormDataItem {
    pathParts.push(key);
    const schemaProperty = schema.properties[key];
    const name = schemaProperty.name;
    const tooltip = schemaProperty.tooltip;
    const helpText = schemaProperty.helpText;
    const required = this.getRequired(schema, key);
    const isReadOnly = Boolean(schemaProperty.isReadOnly) || isParentReadOnly;
    const type = this.getFormDataItemType(schemaProperty);
    const isHidden = Boolean(schemaProperty.isHidden) || isParentHidden;
    const fieldValue = values && !isNullOrUndefined(values[key]) ? values[key] : schemaProperty.default;
    let display: OptionDisplayType;

    switch (type) {
      case FormDataItemType.xOf:
        const children = this.getXOfChildren(schemaProperty, values, key, pathParts, isReadOnly, isHidden);
        const xOfType = Object.values(XOfType).find(xOf => schemaProperty[xOf]);
        display = schemaProperty.oneOf && schemaProperty.display ? schemaProperty.display : this.getSectionDisplayFromParentSchema(schema, key);
        return new XOfDataItem(key, name, tooltip, helpText, required, pathParts, fieldValue, isReadOnly, isHidden, display, children, schemaProperty.description, xOfType);
      case FormDataItemType.Enum:
        return new EnumDataItem(key, name, tooltip, helpText, required, pathParts, fieldValue, isReadOnly, isHidden, schemaProperty.display, schemaProperty);
      case FormDataItemType.Boolean:
        return new FormDataItem(key, name, tooltip, helpText, required, pathParts, type, !!fieldValue, isReadOnly, isHidden);
      case FormDataItemType.Object:
        const childItems = this.getItemsFromSubschema(schemaProperty, fieldValue, pathParts, isReadOnly, isHidden);
        if (!schemaProperty.isConditional) {
          display = this.getSectionDisplayFromParentSchema(schema, key);
          return new ParentDataItem(key, name, tooltip, helpText, required, pathParts, type, fieldValue, isReadOnly, isHidden, childItems, schemaProperty.description, display);
        }
        return new ConditionalParentDataItem(key, name, tooltip, helpText, required, pathParts, fieldValue, isReadOnly, isHidden, childItems);
      case FormDataItemType.SecuredString:
        return new SecuredStringDataItem(key, name, tooltip, helpText, required, pathParts, fieldValue, isReadOnly, isHidden, this.isEdit, schemaProperty.placeholder);
      case FormDataItemType.Integer:
        const intButtons = this.getButtonDataItems(schemaProperty, pathParts);
        const integerOptions: SchemaIntegerOptions = {
          display: schemaProperty.display,
          placeholder: schemaProperty.placeholder ? schemaProperty.placeholder : '',
          minLength: schemaProperty.minLength,
          maxLength: schemaProperty.maxLength,
          minimum: schemaProperty.minimum,
          maximum: schemaProperty.maximum,
          exclusiveMinimum: schemaProperty.exclusiveMinimum,
          exclusiveMaximum: schemaProperty.exclusiveMaximum
        };
        return new IntegerDataItem(key, name, tooltip, helpText, required, pathParts, type, fieldValue, isReadOnly, isHidden, intButtons, integerOptions);
      default: // String
        const buttons = this.getButtonDataItems(schemaProperty, pathParts);
        const stringOptions: SchemaStringOptions = {
          display: schemaProperty.display,
          placeholder: schemaProperty.placeholder ? schemaProperty.placeholder : '',
          format: schemaProperty.format,
          listDelimiter: schemaProperty.listDelimiter,
          minLength: schemaProperty.minLength,
          maxLength: schemaProperty.maxLength,
          pattern: schemaProperty.pattern
        };
        return new StringDataItem(key, name, tooltip, helpText, required, pathParts, type, fieldValue, isReadOnly, isHidden, buttons, stringOptions);
    }
  }

  private getButtonDataItems(schemaProperty: JSONSchemaProperty, pathParts: string[]): ButtonDataItem[] {
    const buttons: ButtonDataItem[] = [];
    Object.keys(schemaProperty).forEach(key => {
      const property = schemaProperty[key];
      if (typeof property === 'object' && property.type === 'button') {
        const name = property.name || '';
        const paths = property.targetPaths && Array.isArray(property.targetPaths) && property.targetPaths.every(i => typeof i === 'string') ? property.targetPaths : [];
        const button = new ButtonDataItem(name, key, pathParts.slice(), paths);
        buttons.push(button);
      }
    });
    return buttons;
  }

  private getFormDataItemType(schemaProperty: JSONSchemaProperty): FormDataItemType {
    if (schemaProperty.enum) {
      return FormDataItemType.Enum;
    }

    if (Object.values(XOfType).some(val => Boolean(schemaProperty[val]))) {
      return FormDataItemType.xOf;
    }

    switch (schemaProperty.type) {
      case SchemaTypes.Boolean:
        return FormDataItemType.Boolean;
      case SchemaTypes.Integer:
        return FormDataItemType.Integer;
      case SchemaTypes.Object:
        return FormDataItemType.Object;
      default:
        return Boolean(schemaProperty.isSecured) ? FormDataItemType.SecuredString : FormDataItemType.String;
    }
  }

  private getRequired(schema: JSFJsonSchema, key: string): boolean {
    const alwaysRequired = Boolean(schema.required) && schema.required.indexOf(key) !== -1;
    const conditionallyRequired = Boolean(schema.conditionallyRequired) && schema.conditionallyRequired.indexOf(key) !== -1;
    return alwaysRequired || conditionallyRequired;
  }

  private getXOfChildren(schema: JSFJsonSchema, values: any, key: string, pathParts: string[], isParentReadOnly: boolean, isParentHidden: boolean): ParentDataItem[] {
    const objects =
      schema[XOfType.OneOf] ||
      schema[XOfType.AllOf] ||
      schema[XOfType.AnyOf];

    return objects.map((object, idx) => {
      const childPathParts = pathParts.slice();
      childPathParts.push(object.key);
      const objectValues =
        values && values[key]
          ? values[key][object.key]
          : {};

      const isHidden = isParentHidden || object.isHidden;
      const isReadOnly = isParentReadOnly || object.isReadOnly;
      const items = this.getItemsFromSubschema(object, objectValues, childPathParts, isReadOnly, isHidden);
      const childObjectDisplay = this.getSectionDisplayFromParentSchema(schema, object.key);

      return new ParentDataItem(
        object.key,
        object.name,
        object.tooltip,
        object.helpText,
        false,
        childPathParts,
        FormDataItemType.Object,
        '',
        isReadOnly,
        isHidden,
        items,
        object.description,
        childObjectDisplay);
    });
  }

  /**
   * Gets the child object's display based upon the display property of the parent.
   * Used for objects and xOfs, though tabs display is not yet supported for oneOf or anyOf.
   *
   * @remarks
   * Display: tabs displays all child objects as tabs, unless further specified with a 'tabs' array.
   * A 'tabs' array without an accompanying 'display: tabs' is ignored. Default display is as sections.
   */
  private getSectionDisplayFromParentSchema(schema: JSFJsonSchema, key: string): OptionDisplayType {
    return !schema.display || schema.display !== OptionDisplayType.TABS || (schema.tabs && !schema.tabs.includes(key))
      ? OptionDisplayType.SECTIONS
      : OptionDisplayType.TABS;
  }

  /**
   * This method finds a FormDataItem using an array of path segments
   * that point to the target FormDataItem. This method will return null if  no FormDataItem is found.
   *
   * @param {string[]} targetPathSegments: an array of path segments that point to the target FormDataItem
   * @param {FormDataItem[]} formDataItems: An array of FormDataItems to search through
   * @returns {FormDataItem}: the target FormDataItem or null if it is not found.
   */
  findFormDataItem(targetPathSegments: string[], formDataItems: FormDataItem[]): FormDataItem {
    if (!targetPathSegments.length) {
      return null;
    }

    const dataItem = formDataItems.find(item => item.key === targetPathSegments[0]);
    if (!dataItem) {
      return null;
    }

    if (targetPathSegments.length === 1) {
      return dataItem as FormDataItem;
    } else if (dataItem instanceof ParentDataItem) {
      return this.findFormDataItem(targetPathSegments.slice(1), (dataItem as ParentDataItem).items);
    } else {
      return null;
    }
  }
}

function isNullOrUndefined(value): boolean {
  return value === null || value === undefined;
}

enum SchemaTypes {
  Boolean = 'boolean',
  Integer = 'integer',
  Object = 'object',
  String = 'string'
}

export interface JSONSchemaProperty {
  type?: string;
  name?: string;
  description?: string;
  enum?: any[];
  enumNames?: string[];
  display?: string;
  isSecured?: boolean;
  format?: string;
  minLength?: number;
  maxLength?: number;
  listDelimiter?: string;
  helpText?: string;
  tooltip?: string;
  default?: any;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  pattern?: string;
}

export interface SchemaIntegerOptions {
  display: string;
  placeholder: string;
  minLength: number;
  maxLength: number;
  maximum: number;
  minimum: number;
  exclusiveMaximum: number;
  exclusiveMinimum: number;
}

export interface SchemaStringOptions {
  display: string;
  placeholder: string;
  format: StringFormat;
  listDelimiter: string;
  minLength: number;
  maxLength: number;
  pattern: string;
}
