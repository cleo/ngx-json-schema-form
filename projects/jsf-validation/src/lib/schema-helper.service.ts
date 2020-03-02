// @dynamic
export class SchemaHelperService {
  private static readonly PROPERTIES_KEY = 'properties';
  public static readonly SECURED_KEY = 'isSecured';
  public static readonly REQUIRED_KEY = 'required';

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
          recursiveFlattening(cur[ p ], prop ? `${prop}.${p}` : p);
        }
        if (isEmpty && prop) {
          flattenedObject[ prop ] = {};
        }
      }
    }

    recursiveFlattening(object, '');
    return flattenedObject;
  }
}
