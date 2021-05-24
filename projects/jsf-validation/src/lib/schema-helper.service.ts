// @dynamic
export class SchemaHelperService {
  public static readonly PROPERTIES_KEY = 'properties';
  public static readonly SECURED_KEY = 'isSecured';
  public static readonly REQUIRED_KEY = 'required';
  public static readonly ENUM_KEY = 'enum';
  public static readonly READONLY_KEY = 'isReadOnly';

  /**
   * Takes in a path to a value in a JSON Schema object and re-formats it.
   * This method removes bulk key words so that the returned string can be compared against
   * a JSON object containing matching values for this schema.
   * @param flattenedSchemaKeyPath: a string that is a path to a value in a JSON object
   * @returns a formatted string that does not include bulk key words
   */
  public static formatKeyPath(flattenedSchemaKeyPath: string): string {
    return flattenedSchemaKeyPath.split('.')
      .filter(value => value !== SchemaHelperService.PROPERTIES_KEY
        && !value.includes(SchemaHelperService.SECURED_KEY)
        && !value.includes(SchemaHelperService.REQUIRED_KEY))
      .join('.');
  }

  public static getFlattenedObject(object): any {
    const flattenedObject = {} as any;

    function recursiveFlattening(cur: any, prop: any) {
      if (Object(cur) !== cur) {
        flattenedObject[ prop ] = cur;
      } else if (Array.isArray(cur)) {
        const l = cur.length;
        for (let i = 0; i < l; i++) {
          recursiveFlattening(cur[ i ], `${prop}[${i}]`);
        }
        if (l === 0) {
          flattenedObject[ prop ] = [];
        }
      } else {
        let isEmpty = true;
        for (const p of Object.keys(cur)) {
          isEmpty = false;
          const childProp = prop ? `${prop}.${p}` : p;
          recursiveFlattening(cur[ p ], childProp);

          // Enums are always required
          if (cur[p][SchemaHelperService.ENUM_KEY] && !SchemaHelperService.hasKey(flattenedObject, childProp, cur, p, SchemaHelperService.READONLY_KEY)) {
            const existingRequiredKeys = SchemaHelperService.getExistingKeys(flattenedObject,  prop, SchemaHelperService.REQUIRED_KEY);
            if (!existingRequiredKeys.length || existingRequiredKeys.every(key => flattenedObject[key] !== p)) {
              SchemaHelperService.setArrayValue(flattenedObject, prop, SchemaHelperService.REQUIRED_KEY, p);
            }
          }
        }
        if (isEmpty && prop) {
          flattenedObject[ prop ] = {};
        }
      }
    }

    recursiveFlattening(object, '');
    return flattenedObject;
  }

  public static getLastIndexOfXOfSegment(schemaFormattedKeySegments: string[], xOfKeyword: string): number {
    // find index of _last_ instance of xOf key to get the most deeply nested xOf
    // https://stackoverflow.com/a/40929530
    // TODO: modify findIndex() to find either the oneOf key, anyOf key, or allOf key
    const index = schemaFormattedKeySegments
      .slice()
      .reverse()
      .findIndex(keySegment => keySegment.includes(xOfKeyword)); // .includes(), since schema format is an array format, ex. oneOf[0], rather than simply oneOf
    return index >= 0 ? (schemaFormattedKeySegments.length - 1) - index : index;
  }

  /**
   * Gets a list of any existing keys that contain a keyword.
   * Example: Passing a key of 'required' will return a list of all child required[#] properties.
   */
  private static getExistingKeys(obj: any, unformattedPath: string, key: string): string[] {
    const path = SchemaHelperService.getParentPathWithoutProperties(unformattedPath);
    const numLevels = path.split('.').length;

    if (path === '') {
      return Object.keys(obj).filter(k => k.includes(key) && !k.includes('.'));
    } else {
      return Object.keys(obj).filter(k => k.includes(`${path}.${key}`) && k.split('.').length === numLevels + 1);
    }
  }

  /**
   * Sets the required attribute in the flattened schema (i.e. required[0] = 'value)
   */
  private static setArrayValue(obj: any, unformattedPath: string, key: string, value: any): void {
    const existingKeys = SchemaHelperService.getExistingKeys(obj, unformattedPath, key);
    const path = SchemaHelperService.getParentPathWithoutProperties(unformattedPath);
    let index = 0;
    if (existingKeys) {
      existingKeys.map(val => {
        const lastSegment = val.lastIndexOf('.');
        if (lastSegment > 0) {
          val = val.substring(lastSegment + 1);
        }
        return val;
      }).forEach(val => {
        const valIndex = Number.parseInt(val.replace(`${key}[`, '').replace(']', ''), 10);
        if (valIndex >= index) {
          index = valIndex + 1;
        }
      });
    }

    if (path === '') {
      obj[`${key}[${index}]`] = value;
    } else {
      obj[`${path}.${key}[${index}]`] = value;
    }
  }

  /**
   * Get the parent's path without the 'properties' node.
   * Returns empty string if at the root level.
   */
  private static getParentPathWithoutProperties(path: string): any {
    const lastSegment = path.lastIndexOf('.');
    if (lastSegment < 0) {
      return '';
    }
    if (path.substring(lastSegment + 1) === SchemaHelperService.PROPERTIES_KEY) {
      return path.substring(0, lastSegment);
    } else {
      return path;
    }
  }

  /**
   * Checks if the current node or any of its parents have a property.
   * Used for inherited properties (i.e. read-only).
   */
  private static hasKey(parentObj: any, parentPath: string, currentObj: any, currentPath: string, key: string): boolean {
    const path = SchemaHelperService.getParentPathWithoutProperties(currentPath);
    if (path === '' && currentObj[key]) {
      return true;
    }

    if (currentObj[currentPath][key]) {
      return true;
    }

    return this.anyParentHasKey(parentObj, parentPath, key);
  }

  /**
   * Checks if any parent of a node has a property.
   */
  private static anyParentHasKey(obj: any, path: string, key: string): boolean {
    const hasKey = SchemaHelperService.getExistingKeys(obj, path, key);

    if (hasKey.length) {
      return true;
    } else {
      const lastSegment = path.lastIndexOf('.');
      if (lastSegment < 0 && path === '') {
        return false;
      } else if (lastSegment < 0) {
        return this.anyParentHasKey(obj, '', key);
      } else {
        const parentPath = path.substring(0, lastSegment);
        return this.anyParentHasKey(obj, parentPath, key);
      }
    }
  }
}

export enum XOfKeys {
  ONE_OF_KEY = 'oneOf',
  ALL_OF_KEY = 'allOf'
}
