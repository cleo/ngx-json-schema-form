import { Injectable } from '@angular/core';

@Injectable()
export class SchemaTranslationService {
  readonly VALIDATION_KEY = 'validation';
  readonly FORMAT_KEY = 'format';
  readonly URL_KEY = 'url';
  readonly URI_KEY = 'uri';
  readonly PROPERTIES_KEY = 'properties';
  readonly NUMBER_KEY = 'number';
  readonly INTEGER_KEY = 'integer';
  readonly TYPE_KEY = 'type';
  readonly ENUM_KEY = 'enum';
  readonly ENUM_NAMES_KEY = 'enumNames';

  translateToLatest(schema: any): any {
    if (!schema.version || schema.version.startsWith('1.')) {
      schema = this.translateV1toV2(schema);
    }

    return schema;
  }

  private translateV1toV2(schema: any): any {
    const keys = Object.keys(schema);

    keys.forEach(key => {
      const value = schema[key];
      if (typeof value === 'object') {
        schema[key] = this.translateV1toV2(value);
      }
    });

    if (keys.includes(this.VALIDATION_KEY)) {
      const originalValue = schema[this.VALIDATION_KEY];
      schema[this.FORMAT_KEY] = originalValue === this.URL_KEY ? this.URI_KEY : originalValue;
      delete schema[this.VALIDATION_KEY];
    }

    if (keys.includes(this.TYPE_KEY) && schema[this.TYPE_KEY] === this.NUMBER_KEY) {
      schema[this.TYPE_KEY] = this.INTEGER_KEY;
    }

    if (keys.includes(this.ENUM_KEY)) {
      const enums = schema[this.ENUM_KEY];
      schema[this.ENUM_KEY] = enums.map(enumItem => enumItem.key);
      schema[this.ENUM_NAMES_KEY] = enums.map(enumItem => enumItem.name);
    }
    // Add additional translation fields here

    return schema;
  }
}
